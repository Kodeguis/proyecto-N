import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft } from 'lucide-react';
import { RomanticButton } from '../ui/RomanticButton';
import { useStore } from '../../stores/appStore';

export const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const adminLogin = useStore((state) => state.adminLogin);
  const setCurrentPage = useStore((state) => state.setCurrentPage);

  const handleAdminLogin = async () => {
    if (!password.trim()) return;
    
    setIsLoading(true);
    setError(false);
    
    // Simular delay para mejor UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const success = adminLogin(password);
    if (!success) {
      setError(true);
      setPassword('');
      setTimeout(() => setError(false), 3000);
    }
    
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdminLogin();
    }
  };

  const goBack = () => {
    setCurrentPage('menu');
  };

  return (
    <div className="min-h-screen bg-admin-gradient bg-[length:400%_400%] animate-gradient-shift flex items-center justify-center p-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-romantic text-center relative">
          {/* Back button */}
          <motion.button
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            onClick={goBack}
            className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </motion.button>

          {/* Header con animación */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex justify-center mb-4">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Shield className="w-16 h-16 text-purple-600" />
              </motion.div>
            </div>
            <h1 className="text-3xl font-bold text-purple-600 mb-2">
              Panel de Admin
            </h1>
            <p className="text-gray-600 text-sm">
              Acceso exclusivo para administradores 🔧
            </p>
          </motion.div>

          {/* Formulario de login */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-6"
          >
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Código de administrador"
                maxLength={20}
                className={`
                  w-full px-6 py-4 rounded-2xl border-2 text-center text-lg font-medium
                  transition-all duration-300 focus:outline-none focus:ring-4
                  ${error 
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-200 animate-pulse' 
                    : 'border-purple-300 focus:border-purple-500 focus:ring-purple-200'
                  }
                  focus:scale-105 tracking-widest
                `}
                disabled={isLoading}
              />
            </div>

            {/* Mensaje de error animado */}
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ 
                opacity: error ? 1 : 0, 
                height: error ? 'auto' : 0 
              }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="text-red-500 text-sm flex items-center justify-center">
                <Shield className="w-4 h-4 mr-1" />
                Código incorrecto. Intenta de nuevo.
              </div>
            </motion.div>

            {/* Botón de login */}
            <RomanticButton
              onClick={handleAdminLogin}
              disabled={!password.trim() || isLoading}
              loading={isLoading}
              size="lg"
              fullWidth
              variant="secondary"
            >
              {isLoading ? 'Verificando...' : 'Acceder 🔐'}
            </RomanticButton>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};