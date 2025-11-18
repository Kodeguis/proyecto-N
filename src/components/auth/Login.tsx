import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, UserPlus } from 'lucide-react';
import { FloatingHearts } from '../ui/FloatingHearts';
import { RomanticButton } from '../ui/RomanticButton';
import { useStore } from '../../stores/appStoreDB';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const login = useStore((state) => state.login);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) return;
    
    setIsLoading(true);
    setError(false);
    
    // Simular delay para mejor UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const success = await login(username, password);
    if (!success) {
      setError(true);
      setPassword('');
      setTimeout(() => setError(false), 3000);
    }
    
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-romantic-gradient bg-[length:400%_400%] animate-gradient-shift flex items-center justify-center p-4 relative overflow-hidden">
      <FloatingHearts />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-romantic text-center relative">
          {/* Header con animación */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex justify-center mb-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              >
                <Heart className="w-16 h-16 text-romantic-pink fill-current" />
              </motion.div>
            </div>
            <h1 className="text-3xl font-bold text-romantic-pink mb-2">
              Bienvenida
            </h1>
            <p className="text-gray-600 text-sm">
              Este es nuestro espacio especial 💖
            </p>
          </motion.div>

          {/* Formulario de login */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-4"
          >
            {/* Campo de usuario */}
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Usuario"
                maxLength={20}
                className={`
                  w-full px-6 py-4 rounded-2xl border-2 text-center text-lg font-medium
                  transition-all duration-300 focus:outline-none focus:ring-4
                  ${error 
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-200 animate-pulse' 
                    : 'border-romantic-light focus:border-romantic-pink focus:ring-romantic-pink/20'
                  }
                  focus:scale-105
                `}
                disabled={isLoading}
              />
              
              {/* Icono de usuario */}
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Heart className="w-5 h-5 text-romantic-light" />
              </div>
            </div>

            {/* Campo de contraseña */}
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Contraseña"
                maxLength={20}
                className={`
                  w-full px-6 py-4 rounded-2xl border-2 text-center text-lg font-medium
                  transition-all duration-300 focus:outline-none focus:ring-4
                  ${error 
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-200 animate-pulse' 
                    : 'border-romantic-light focus:border-romantic-pink focus:ring-romantic-pink/20'
                  }
                  focus:scale-105 tracking-widest
                `}
                disabled={isLoading}
              />
              
              {/* Icono de candado */}
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Sparkles className="w-5 h-5 text-romantic-light" />
              </div>
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
                <Heart className="w-4 h-4 mr-1 fill-current" />
                Usuario o contraseña incorrectos. Intenta de nuevo.
              </div>
            </motion.div>

            {/* Botón de login */}
            <RomanticButton
              onClick={handleLogin}
              disabled={!username.trim() || !password.trim() || isLoading}
              loading={isLoading}
              size="lg"
              fullWidth
            >
              {isLoading ? 'Verificando...' : 'Entrar ✨'}
            </RomanticButton>
          </motion.div>

          {/* Footer con tips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-8 pt-6 border-t border-gray-200 space-y-2"
          >
            <p className="text-xs text-gray-500">
              💡 Tip: Presiona Enter para ingresar más rápido
            </p>
            <button
              onClick={() => setCurrentPage('register')}
              className="text-romantic-pink hover:text-romantic-dark text-sm underline flex items-center justify-center gap-1 w-full"
              disabled={isLoading}
            >
              <UserPlus className="w-4 h-4" />
              ¿Primera vez? Crear cuenta
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};