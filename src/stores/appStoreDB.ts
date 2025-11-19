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
  
  // Admin functions
  adminUpdatePoints: (userId: string, points: number) => Promise<boolean>;
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
        
        console.log('=== ADDPOINTS INICIADO ===');
        console.log('Usuario actual:', state.currentUser.id);
        console.log('Puntos a añadir:', points);
        
        try {
          // Primero actualizar en base de datos
          const success = await api.pointsAPI.updatePoints(state.currentUser.id, points);
          console.log('Actualización en base de datos:', success ? 'EXITOSA' : 'FALLIDA');
          
          if (success) {
            // Si la BD actualizó correctamente, actualizar estado local
            const currentPoints = state.userData.points;
            const newPoints = currentPoints + points;
            console.log('Actualizando estado local - Puntos actuales:', currentPoints, 'Nuevos puntos:', newPoints);
            
            set((state) => ({
              userData: {
                ...state.userData,
                points: newPoints,
                totalPointsEarned: state.userData.totalPointsEarned + Math.max(points, 0)
              }
            }));
            
            console.log('✅ Estado local actualizado');
            
            // Sincronizar con base de datos para asegurar consistencia
            await state.syncUserData();
            console.log('✅ Sincronización completada');
          } else {
            console.log('❌ No se actualizó el estado local porque falló la BD');
          }
          
          return success;
        } catch (error) {
          console.error('❌ Error agregando puntos:', error);
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
        if (!state.currentUser) {
          console.log('❌ syncUserData: No hay usuario actual');
          return;
        }
        
        console.log('=== SYNC USER DATA INICIADO ===');
        console.log('Usuario actual:', state.currentUser.id);
        
        try {
          console.log('Obteniendo datos de base de datos...');
          const userPoints = await api.pointsAPI.getUserPoints(state.currentUser.id);
          console.log('Puntos obtenidos:', userPoints);
          
          const openedDays = await api.dailyMessagesAPI.getOpenedDays(state.currentUser.id);
          console.log('Días abiertos:', openedDays);
          
          const usedCoupons = await api.couponsAPI.getUsedCoupons(state.currentUser.id);
          console.log('Cupones usados:', usedCoupons);
          
          const answeredQuestions = await api.triviaAPI.getAnsweredQuestions(state.currentUser.id);
          console.log('Preguntas respondidas:', answeredQuestions);
          
          const userData: UserData = {
            points: userPoints?.points || 0,
            totalPointsEarned: userPoints?.total_points_earned || 0,
            unlockedCoupons: [],
            usedCoupons: usedCoupons,
            openedDays: openedDays,
            triviaScore: answeredQuestions.filter(q => q.isCorrect).length,
            triviaCompleted: answeredQuestions.map(q => q.questionId),
          };
          
          console.log('Nuevos datos de usuario:', userData);
          set({ userData });
          console.log('✅ Sincronización completada');
        } catch (error) {
          console.error('❌ Error sincronizando datos:', error);
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

      // Función especial para admin - puede actualizar puntos de cualquier usuario
      adminUpdatePoints: async (userId: string, points: number) => {
        console.log('=== ADMIN UPDATE POINTS INICIADO ===');
        console.log('Usuario objetivo:', userId);
        console.log('Puntos a añadir:', points);
        
        try {
          const success = await api.pointsAPI.updatePoints(userId, points);
          console.log('Actualización en base de datos:', success ? 'EXITOSA' : 'FALLIDA');
          
          // Si el admin está actualizando su propio usuario, actualizar estado local
          const state = get();
          if (success && state.currentUser && state.currentUser.id === userId) {
            console.log('El admin está actualizando sus propios puntos - actualizando estado local');
            
            // Actualizar estado local inmediatamente
            const currentPoints = state.userData.points;
            const newPoints = currentPoints + points;
            
            set((state) => ({
              userData: {
                ...state.userData,
                points: newPoints,
                totalPointsEarned: state.userData.totalPointsEarned + Math.max(points, 0)
              }
            }));
            
            console.log('Estado local actualizado para el admin:', newPoints);
          } else if (success) {
            // Si el admin actualizó otro usuario, también sincronizar para asegurar consistencia
            console.log('Admin actualizó otro usuario, sincronizando datos...');
            await state.syncUserData();
          }
          
          return success;
        } catch (error) {
          console.error('❌ Error actualizando puntos como admin:', error);
          return false;
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