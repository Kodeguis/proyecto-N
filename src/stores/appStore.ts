import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserData {
  points: number;
  unlockedCoupons: number[];
  usedCoupons: number[];
  openedDays: number[];
  triviaScore: number;
  triviaCompleted: number[];
}

export interface AppState {
  // Auth
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  
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
  addPoints: (points: number) => void;
  unlockCoupon: (couponId: number) => void;
  useCoupon: (couponId: number) => void;
  openDay: (day: number) => void;
  resetUserData: () => void;
  resetAll: () => void;
}

const initialUserData: UserData = {
  points: 0,
  unlockedCoupons: [],
  usedCoupons: [],
  openedDays: [],
  triviaScore: 0,
  triviaCompleted: [],
};

const PASSWORD = 'nicos';
const ADMIN_PASSWORD = 'kode123';

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth
      isAuthenticated: false,
      isAdmin: false,
      
      // User data
      userData: initialUserData,
      
      // UI State
      currentPage: 'login',
      isLoading: false,
      
      // Actions
      login: (password: string) => {
        if (password === PASSWORD || password === ADMIN_PASSWORD) {
          set({ 
            isAuthenticated: true, 
            isAdmin: password === ADMIN_PASSWORD,
            currentPage: password === ADMIN_PASSWORD ? 'admin' : 'menu' 
          });
          return true;
        }
        return false;
      },
      
      logout: () => {
        set({ 
          isAuthenticated: false, 
          isAdmin: false,
          currentPage: 'login',
          userData: initialUserData 
        });
      },
      
      adminLogin: (password: string) => {
        if (password === ADMIN_PASSWORD) {
          set({ isAdmin: true, isAuthenticated: true, currentPage: 'admin' });
          return true;
        }
        return false;
      },
      
      setUserData: (data: Partial<UserData>) => {
        set(state => ({
          userData: { ...state.userData, ...data }
        }));
      },
      
      setCurrentPage: (page: string) => {
        set({ currentPage: page });
      },
      
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
      
      addPoints: (points: number) => {
        set(state => ({
          userData: {
            ...state.userData,
            points: Math.max(0, state.userData.points + points)
          }
        }));
      },
      
      unlockCoupon: (couponId: number) => {
        set(state => {
          const newUnlocked = [...state.userData.unlockedCoupons];
          if (!newUnlocked.includes(couponId)) {
            newUnlocked.push(couponId);
          }
          return {
            userData: {
              ...state.userData,
              unlockedCoupons: newUnlocked
            }
          };
        });
      },
      
      useCoupon: (couponId: number) => {
        set(state => {
          const newUsed = [...state.userData.usedCoupons];
          if (!newUsed.includes(couponId)) {
            newUsed.push(couponId);
          }
          return {
            userData: {
              ...state.userData,
              usedCoupons: newUsed
            }
          };
        });
      },
      
      openDay: (day: number) => {
        set(state => {
          const newOpened = [...state.userData.openedDays];
          if (!newOpened.includes(day)) {
            newOpened.push(day);
          }
          return {
            userData: {
              ...state.userData,
              openedDays: newOpened
            }
          };
        });
      },
      
      resetUserData: () => {
        set({ userData: initialUserData });
      },
      
      resetAll: () => {
        set({ 
          userData: initialUserData,
          isAuthenticated: false,
          isAdmin: false,
          currentPage: 'login'
        });
      },
    }),
    {
      name: 'nuestro-espacio-especial',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
        userData: state.userData,
        currentPage: state.currentPage,
      }),
    }
  )
);