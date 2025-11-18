import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface RomanticButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const variants = {
  primary: 'bg-love-gradient text-white shadow-love hover:shadow-romantic',
  secondary: 'bg-white text-romantic-pink border-2 border-romantic-pink hover:bg-romantic-soft',
  danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg',
  success: 'bg-green-500 text-white hover:bg-green-600 shadow-lg',
  warning: 'bg-yellow-500 text-white hover:bg-yellow-600 shadow-lg',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export const RomanticButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  className = '',
}: RomanticButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        rounded-2xl font-semibold transition-all duration-300
        transform hover:-translate-y-1 active:scale-95
        focus:outline-none focus:ring-4 focus:ring-romantic-pink/20
        ${className}
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></div>
          Cargando...
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
};