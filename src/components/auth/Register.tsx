import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, UserPlus } from 'lucide-react';
import { FloatingHearts } from '../ui/FloatingHearts';
import { RomanticButton } from '../ui/RomanticButton';
import { useStore } from '../../stores/appStoreDB';
import api from '../../lib/api';
import { supabase } from '../../lib/supabase';

export const Register = ({ setCurrentPage }: { setCurrentPage: (page: string) => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRegister = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Verificar si el usuario ya existe
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .single();

      if (existingUser) {
        setError('Este usuario ya existe');
        setIsLoading(false);
        return;
      }

      // Crear nuevo usuario
      const newUser = await api.authAPI.register(username, password);
      
      if (newUser) {
        setIsSuccess(true);
        setTimeout(() => {
          setCurrentPage('login');
        }, 2000);
      } else {
        setError('Error al crear el usuario');
      }
    } catch (error) {
      console.error('Error en registro:', error);
      setError('Error al registrar usuario');
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleRegister();
    }
  };

  return (
    <div className="min-h-screen bg-romantic-gradient bg-[length:400%_400%] animate-gradient-shift relative overflow-hidden flex items-center justify-center p-4">
      <FloatingHearts />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
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
                <UserPlus className="w-16 h-16 text-romantic-pink" />
              </motion.div>
            </div>
            <h1 className="text-3xl font-bold text-romantic-pink mb-2">
              Crear Cuenta
            </h1>
            <p className="text-gray-600 text-sm">
              Únete a nuestro espacio especial 💖
            </p>
          </motion.div>

          {/* Formulario de registro */}
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
                disabled={isLoading || isSuccess}
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
                disabled={isLoading || isSuccess}
              />
              
              {/* Icono de candado */}
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Sparkles className="w-5 h-5 text-romantic-light" />
              </div>
            </div>

            {/* Campo de confirmar contraseña */}
            <div className="relative">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Confirmar Contraseña"
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
                disabled={isLoading || isSuccess}
              />
              
              {/* Icono de verificación */}
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Heart className="w-5 h-5 text-romantic-light" />
              </div>
            </div>

            {/* Mensaje de error/éxito animado */}
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ 
                opacity: error || isSuccess ? 1 : 0, 
                height: error || isSuccess ? 'auto' : 0 
              }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              {error && (
                <div className="text-red-500 text-sm flex items-center justify-center">
                  <Heart className="w-4 h-4 mr-1 fill-current" />
                  {error}
                </div>
              )}
              {isSuccess && (
                <div className="text-green-500 text-sm flex items-center justify-center">
                  <Heart className="w-4 h-4 mr-1 fill-current" />
                  ¡Usuario creado exitosamente! Redirigiendo...
                </div>
              )}
            </motion.div>

            {/* Botón de registro */}
            <RomanticButton
              onClick={handleRegister}
              disabled={!username.trim() || !password.trim() || !confirmPassword.trim() || isLoading || isSuccess}
              loading={isLoading}
              size="lg"
              fullWidth
            >
              {isLoading ? 'Creando...' : isSuccess ? '¡Listo!' : 'Crear Cuenta ✨'}
            </RomanticButton>

            {/* Link para volver al login */}
            <button
              onClick={() => setCurrentPage('login')}
              className="text-romantic-pink hover:text-romantic-dark text-sm underline"
              disabled={isLoading}
            >
              ¿Ya tienes cuenta? Inicia sesión
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};