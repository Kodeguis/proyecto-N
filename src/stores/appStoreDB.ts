import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';

export interface UserData {
  points: number;
  unlockedCoupons: number[];
  usedCoupons: number[];
  openedDays: number[];
  triviaScore: number;
  triviaCompleted: number[];
  totalPointsEarned: number;
}

export interface User {
  id: string;
  username: string;
  is_admin: boolean;
  created_at: string;
}

export interface AppState {
  // Auth
  isAuthenticated: boolean;
  currentUser: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, password: string) => Promise<boolean>;
  
  // User data
  userData: UserData;
  setUserData: (data: Partial<UserData>) => void;
  
  // UI State
  currentPage: string;
  setCurrentPage: (page: string) => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  
  // Admin
  isAdmin: boolean;
  adminLogin: (password: string) => boolean;
  
  // Actions
  addPoints: (points: number) => Promise<boolean>;
  unlockCoupon: (couponId: number) => void;
  useCoupon: (couponId: number) => Promise<boolean>;
  openDay: (day: number) => Promise<boolean>;
  resetUserData: () => void;
  resetAll: () => void;
  
  // Database sync
  syncUserData: () => Promise<void>;
  initializeUser: (userId: string) => Promise<void>;
}

const initialUserData: UserData = {
  points: 0,
  unlockedCoupons: [],
  usedCoupons: [],
  openedDays: [],
  triviaScore: 0,
  triviaCompleted: [],
  totalPointsEarned: 0,
};

const ADMIN_PASSWORD = 'kode123';

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      isAuthenticated: false,
      currentUser: null,
      userData: { ...initialUserData },
      currentPage: 'login',
      isLoading: false,
      isAdmin: false,

      // Auth
      login: async (username: string, password: string) => {
        set({ isLoading: true });
        
        try {
          // Login con API
          const user = await api.authAPI.login(username, password);
          
          if (user) {
            // Obtener datos del usuario desde la base de datos
            const userPoints = await api.pointsAPI.getUserPoints(user.id);
            const openedDays = await api.dailyMessagesAPI.getOpenedDays(user.id);
            const usedCoupons = await api.couponsAPI.getUsedCoupons(user.id);
            const answeredQuestions = await api.triviaAPI.getAnsweredQuestions(user.id);
            
            const userData: UserData = {
              points: userPoints?.points || 0,
              totalPointsEarned: userPoints?.total_points_earned || 0,
              unlockedCoupons: [], // Se manejará con lógica de negocio
              usedCoupons: usedCoupons,
              openedDays: openedDays,
              triviaScore: answeredQuestions.filter(q => q.isCorrect).length * 10,
              triviaCompleted: answeredQuestions.map(q => q.questionId),
            };

            set({
              isAuthenticated: true,
              currentUser: user,
              userData,
              isAdmin: user.is_admin,
              currentPage: 'menu',
              isLoading: false,
            });
            
            return true;
          }
        } catch (error) {
          console.error('Error en login:', error);
        }
        
        set({ isLoading: false });
        return false;
      },

      register: async (username: string, password: string) => {
        set({ isLoading: true });
        
        try {
          const newUser = await api.authAPI.register(username, password);
          
          if (newUser) {
            // Iniciar sesión automáticamente después del registro
            return await get().login(username, password);
          }
        } catch (error) {
          console.error('Error en registro:', error);
        }
        
        set({ isLoading: false });
        return false;
      },

      logout: () => {
        set({
          isAuthenticated: false,
          currentUser: null,
          userData: { ...initialUserData },
          currentPage: 'login',
          isLoading: false,
          isAdmin: false,
        });
      },

      // UI State
      setCurrentPage: (page: string) => {
        console.log('=== STORE: setCurrentPage llamado con:', page);
        console.log('=== STORE: Estado actual antes:', get().currentPage);
        set({ currentPage: page });
        console.log('=== STORE: Estado después:', get().currentPage);
      },
      setLoading: (loading: boolean) => set({ isLoading: loading }),

      // Admin
      adminLogin: (password: string) => {
        if (password === ADMIN_PASSWORD) {
          set({
            isAuthenticated: true,
            isAdmin: true,
            currentPage: 'admin',
          });
          return true;
        }
        return false;
      },

      // User data
      setUserData: (data: Partial<UserData>) => {
        set((state) => ({
          userData: { ...state.userData, ...data },
        }));
      },

      // Actions con base de datos
      addPoints: async (points: number) => {
        const state = get();
        if (!state.currentUser) return false;
        
        try {
          const success = await api.pointsAPI.updatePoints(state.currentUser.id, points);
          if (success) {
            await state.syncUserData();
          }
          return success;
        } catch (error) {
          console.error('Error agregando puntos:', error);
          return false;
        }
      },

      unlockCoupon: (couponId: number) => {
        set((state) => ({
          userData: {
            ...state.userData,
            unlockedCoupons: [...state.userData.unlockedCoupons, couponId],
          },
        }));
      },

      useCoupon: async (couponId: number) => {
        const state = get();
        if (!state.currentUser) return false;
        
        try {
          const success = await api.couponsAPI.useCoupon(state.currentUser.id, couponId);
          if (success) {
            set((state) => ({
              userData: {
                ...state.userData,
                usedCoupons: [...state.userData.usedCoupons, couponId],
              },
            }));
          }
          return success;
        } catch (error) {
          console.error('Error usando cupón:', error);
          return false;
        }
      },

      openDay: async (day: number) => {
        const state = get();
        if (!state.currentUser) return false;
        
        try {
          const success = await api.dailyMessagesAPI.openDay(state.currentUser.id, day);
          if (success) {
            await state.syncUserData();
          }
          return success;
        } catch (error) {
          console.error('Error abriendo día:', error);
          return false;
        }
      },

      // Database sync
      syncUserData: async () => {
        const state = get();
        if (!state.currentUser) return;
        
        try {
          const userPoints = await api.pointsAPI.getUserPoints(state.currentUser.id);
          const openedDays = await api.dailyMessagesAPI.getOpenedDays(state.currentUser.id);
          const usedCoupons = await api.couponsAPI.getUsedCoupons(state.currentUser.id);
          const answeredQuestions = await api.triviaAPI.getAnsweredQuestions(state.currentUser.id);
          
          const userData: UserData = {
            points: userPoints?.points || 0,
            totalPointsEarned: userPoints?.total_points_earned || 0,
            unlockedCoupons: [],
            usedCoupons: usedCoupons,
            openedDays: openedDays,
            triviaScore: answeredQuestions.filter(q => q.isCorrect).length * 10,
            triviaCompleted: answeredQuestions.map(q => q.questionId),
          };

          set({ userData });
        } catch (error) {
          console.error('Error sincronizando datos:', error);
        }
      },

      initializeUser: async (userId: string) => {
        try {
          // Crear registro de puntos si no existe
          const existingPoints = await api.pointsAPI.getUserPoints(userId);
          if (!existingPoints) {
            await api.pointsAPI.createUserPoints(userId);
          }
        } catch (error) {
          console.error('Error inicializando usuario:', error);
        }
      },

      // Reset functions
      resetUserData: () => {
        set({ userData: { ...initialUserData } });
      },

      resetAll: () => {
        set({
          isAuthenticated: false,
          currentUser: null,
          userData: { ...initialUserData },
          currentPage: 'login',
          isLoading: false,
          isAdmin: false,
        });
      },
    }),
    {
      name: 'birthday-app-storage',
      partialize: (state) => ({
        // Solo persistir ciertos datos en localStorage como respaldo
        isAuthenticated: state.isAuthenticated,
        currentUser: state.currentUser,
        currentPage: state.currentPage,
        isAdmin: state.isAdmin,
      }),
    }
  )
);