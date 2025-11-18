// Type definitions for the romantic app

export interface UserData {
  points: number;
  unlockedCoupons: number[];
  usedCoupons: number[];
  openedDays: number[];
  triviaScore: number;
  triviaCompleted: boolean[];
}

export interface Coupon {
  id: number;
  icon: string;
  name: string;
  requiredPoints: number;
}

export interface TriviaQuestion {
  question: string;
  options: string[];
  correct: number;
}

export interface LoveMessage {
  id: number;
  text: string;
  date: string;
}

export interface AppState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  currentPage: string;
  isLoading: boolean;
  userData: UserData;
}

export interface MenuItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  isNew?: boolean;
  isLocked?: boolean;
  comingSoon?: boolean;
}

export interface NavigationState {
  from: string;
  to: string;
  timestamp: number;
}

export interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  details?: Record<string, any>;
}

export interface AppConfig {
  loveMessages: string[];
  triviaQuestions: TriviaQuestion[];
  couponRequirements: Record<number, number>;
  app: {
    name: string;
    version: string;
    password: string;
    adminPassword: string;
  };
}

export type PageType = 
  | 'login'
  | 'admin-login'
  | 'menu'
  | 'admin'
  | 'cumpleanos'
  | 'mensajes-diarios'
  | 'trivia'
  | 'cupones';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface RomanticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export interface FloatingHeart {
  id: number;
  x: number;
  emoji: string;
  duration: number;
  delay: number;
}

export interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  duration: number;
  size: number;
}