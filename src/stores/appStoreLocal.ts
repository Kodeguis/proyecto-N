import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  
  // Database sync (placeholder)
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

const ADMIN_PASSWORD = 'admin123';

// Base de datos local simulada
const localUsers = new Map<string, { password: string; user: User }>();

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

      // Auth - Login simple sin base de datos
      login: async (username: string, password: string) => {
        set({ isLoading: true });
        
        try {
          console.log('=== LOGIN: Intentando login con:', username);
          
          // Buscar usuario local
          const userData = localUsers.get(username);
          if (userData && userData.password === password) {
            console.log('=== LOGIN: Usuario encontrado localmente');
            
            set({
              isAuthenticated: true,
              currentUser: userData.user,
              isAdmin: userData.user.is_admin,
              currentPage: 'menu',
              isLoading: false,
            });
            
            return true;
          }
          
          // Usuario por defecto (nico/nico123)
          if (username === 'nico' && password === 'nico123') {
            console.log('=== LOGIN: Usuario por defecto');
            
            const defaultUser: User = {
              id: 'default-user',
              username: 'nico',
              is_admin: false,
              created_at: new Date().toISOString(),
            };
            
            set({
              isAuthenticated: true,
              currentUser: defaultUser,
              isAdmin: false,
              currentPage: 'menu',
              isLoading: false,
            });
            
            return true;
          }
          
          console.log('=== LOGIN: Credenciales incorrectas');
        } catch (error) {
          console.error('Error en login:', error);
        }
        
        set({ isLoading: false });
        return false;
      },

      register: async (username: string, password: string) => {
        set({ isLoading: true });
        
        try {
          console.log('=== REGISTER: Intentando registro con:', username);
          
          // Verificar si ya existe
          if (localUsers.has(username)) {
            console.log('=== REGISTER: Usuario ya existe');
            set({ isLoading: false });
            return false;
          }
          
          // Crear nuevo usuario
          const newUser: User = {
            id: `user-${Date.now()}`,
            username: username,
            is_admin: false,
            created_at: new Date().toISOString(),
          };
          
          localUsers.set(username, { password, user: newUser });
          console.log('=== REGISTER: Usuario creado exitosamente');
          
          // Iniciar sesión automáticamente
          return await get().login(username, password);
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
          isAdmin: false,
          currentPage: 'login',
        });
      },

      adminLogin: (password: string) => {
        if (password === ADMIN_PASSWORD) {
          set({
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
          userData: { ...state.userData, ...data }
        }));
      },

      // Actions locales
      addPoints: async (points: number) => {
        console.log('=== ADDPOINTS LOCAL:', points);
        const currentPoints = get().userData.points;
        const newPoints = currentPoints + points;
        
        get().setUserData({
          points: newPoints,
          totalPointsEarned: get().userData.totalPointsEarned + points
        });
        
        return true;
      },

      unlockCoupon: (couponId: number) => {
        const { unlockedCoupons } = get().userData;
        if (!unlockedCoupons.includes(couponId)) {
          get().setUserData({
            unlockedCoupons: [...unlockedCoupons, couponId]
          });
        }
      },

      useCoupon: async (couponId: number) => {
        const { usedCoupons, unlockedCoupons } = get().userData;
        
        if (unlockedCoupons.includes(couponId) && !usedCoupons.includes(couponId)) {
          get().setUserData({
            usedCoupons: [...usedCoupons, couponId]
          });
          return true;
        }
        return false;
      },

      openDay: async (day: number) => {
        const { openedDays } = get().userData;
        if (!openedDays.includes(day)) {
          get().setUserData({
            openedDays: [...openedDays, day]
          });
          return true;
        }
        return false;
      },

      resetUserData: () => {
        get().setUserData({ ...initialUserData });
      },

      resetAll: () => {
        set({
          userData: { ...initialUserData },
          isAuthenticated: false,
          currentUser: null,
          isAdmin: false,
          currentPage: 'login',
        });
      },

      // Placeholder functions
      syncUserData: async () => {
        console.log('=== SYNC: Modo local, sin sincronización');
      },

      initializeUser: async (userId: string) => {
        console.log('=== INIT: Modo local, sin inicialización');
      },

      adminUpdatePoints: async (userId: string, points: number) => {
        console.log('=== ADMIN UPDATE: Modo local, actualizando puntos');
        get().setUserData({ points });
        return true;
      },

    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        currentUser: state.currentUser,
        userData: state.userData,
        isAdmin: state.isAdmin,
        currentPage: state.currentPage,
      }),
    }
  )
);