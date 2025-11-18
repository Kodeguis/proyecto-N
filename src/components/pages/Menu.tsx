import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Gift, CalendarDays, Gamepad2, Ticket, Crown, Settings } from 'lucide-react';
import { FloatingHearts } from '../ui/FloatingHearts';
import { AnimatedBackground } from '../ui/AnimatedBackground';
import { RomanticButton } from '../ui/RomanticButton';
import { useStore } from '../../stores/appStoreDB';

interface MenuItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  isNew?: boolean;
  isLocked?: boolean;
  comingSoon?: boolean;
}

export const Menu = () => {
  const [greeting, setGreeting] = useState('');
  const logout = useStore((state) => state.logout);
  const userData = useStore((state) => state.userData);
  const currentUser = useStore((state) => state.currentUser);
  const setCurrentPage = useStore((state) => state.setCurrentPage);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('¡Buenos días, mi amor! ☀️');
    } else if (hour < 18) {
      setGreeting('¡Buenas tardes, preciosa! 🌸');
    } else {
      setGreeting('¡Buenas noches, mi vida! 🌙');
    }
  }, []);

  const menuItems: MenuItem[] = [
    {
      id: 'cumpleanos',
      title: 'Cumpleaños 2025',
      description: 'Tu regalo especial con fotos, carta y todos nuestros momentos juntos',
      icon: <Gift className="w-8 h-8" />,
      color: 'from-pink-400 to-rose-500',
      isNew: true,
    },
    {
      id: 'mensajes-diarios',
      title: 'Mensajes Diarios',
      description: 'Un mensaje especial cada día del mes solo para ti',
      icon: <Heart className="w-8 h-8" />,
      color: 'from-red-400 to-pink-500',
      isNew: true,
    },
    {
      id: 'trivia',
      title: '¿Cuánto me conoces?',
      description: 'Divertida trivia sobre nuestra relación y sobre mí',
      icon: <Gamepad2 className="w-8 h-8" />,
      color: 'from-purple-400 to-pink-500',
      isNew: true,
    },
    {
      id: 'cupones',
      title: 'Cupones de Amor',
      description: 'Cupones especiales que puedes canjear cuando quieras',
      icon: <Ticket className="w-8 h-8" />,
      color: 'from-yellow-400 to-orange-500',
      isNew: true,
    },
    {
      id: 'cuenta-regresiva',
      title: 'Cuenta Regresiva',
      description: 'Para una fecha especial que viene...',
      icon: <CalendarDays className="w-8 h-8" />,
      color: 'from-blue-400 to-purple-500',
      isLocked: true,
      comingSoon: true,
    },
    {
      id: 'galeria',
      title: 'Galería Especial',
      description: 'Más fotos y momentos que vienen pronto',
      icon: <Sparkles className="w-8 h-8" />,
      color: 'from-green-400 to-blue-500',
      isLocked: true,
      comingSoon: true,
    },
    {
      id: 'historia',
      title: 'Nuestra Historia',
      description: 'La línea del tiempo de nuestro amor',
      icon: <Heart className="w-8 h-8" />,
      color: 'from-indigo-400 to-purple-500',
      isLocked: true,
      comingSoon: true,
    },
    {
      id: 'playlist',
      title: 'Playlist Especial',
      description: 'Canciones que nos representan',
      icon: <Crown className="w-8 h-8" />,
      color: 'from-teal-400 to-green-500',
      isLocked: true,
      comingSoon: true,
    },
  ];

  const handleMenuClick = (item: MenuItem) => {
    if (item.isLocked) {
      return;
    }
    setCurrentPage(item.id);
  };

  const handleAdminClick = () => {
    setCurrentPage('admin-login');
  };

  return (
    <div className="min-h-screen bg-romantic-gradient bg-[length:400%_400%] animate-gradient-shift relative overflow-hidden">
      <AnimatedBackground />
      <FloatingHearts />
      
      {/* Header */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-20 p-6"
      >
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="text-white drop-shadow-lg">
            <h1 className="text-2xl font-bold mb-1 text-shadow-lg">{greeting}</h1>
            <p className="text-sm opacity-90 text-shadow">
              {currentUser ? `Hola ${currentUser.username} 💖` : 'Tengo tantas cosas especiales para ti 💖'}
            </p>
          </div>
          
          <div className="flex gap-3">
            <RomanticButton
              onClick={handleAdminClick}
              variant="secondary"
              size="sm"
            >
              <Settings className="w-4 h-4" />
            </RomanticButton>
            <RomanticButton
              onClick={logout}
              variant="secondary"
              size="sm"
            >
              Salir 👋
            </RomanticButton>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="relative z-20 max-w-6xl mx-auto px-6 mb-8"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/30 backdrop-blur-md rounded-2xl p-4 text-center text-white border border-white/20 shadow-lg">
            <div className="text-2xl font-bold text-shadow-lg">{userData.points}</div>
            <div className="text-sm opacity-90 text-shadow">Puntos</div>
          </div>
          <div className="bg-white/30 backdrop-blur-md rounded-2xl p-4 text-center text-white border border-white/20 shadow-lg">
            <div className="text-2xl font-bold text-shadow-lg">{userData.unlockedCoupons.length}</div>
            <div className="text-sm opacity-90 text-shadow">Cupones</div>
          </div>
          <div className="bg-white/30 backdrop-blur-md rounded-2xl p-4 text-center text-white border border-white/20 shadow-lg">
            <div className="text-2xl font-bold text-shadow-lg">{userData.openedDays.length}</div>
            <div className="text-sm opacity-90 text-shadow">Mensajes</div>
          </div>
          <div className="bg-white/30 backdrop-blur-md rounded-2xl p-4 text-center text-white border border-white/20 shadow-lg">
            <div className="text-2xl font-bold text-shadow-lg">{userData.triviaScore}</div>
            <div className="text-sm opacity-90 text-shadow">Trivia</div>
          </div>
        </div>
      </motion.div>

      {/* Menu Grid */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="relative z-20 max-w-6xl mx-auto px-6 pb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {menuItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: item.isLocked ? 1 : 1.05 }}
                whileTap={{ scale: item.isLocked ? 1 : 0.95 }}
                onClick={() => handleMenuClick(item)}
                className={`
                  relative bg-gradient-to-br ${item.color} rounded-3xl p-6 text-white
                  shadow-love hover:shadow-romantic transition-all duration-300
                  cursor-pointer overflow-hidden group
                  ${item.isLocked ? 'opacity-60 cursor-not-allowed' : ''}
                `}
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                {/* New badge */}
                {item.isNew && (
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold"
                  >
                    NUEVO
                  </motion.div>
                )}
                
                {/* Lock icon */}
                {item.isLocked && (
                  <div className="absolute top-3 right-3 text-white/70">
                    <div className="text-2xl">🔒</div>
                  </div>
                )}
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm opacity-90 leading-relaxed">
                    {item.description}
                  </p>
                  
                  {item.comingSoon && (
                    <div className="mt-3 text-xs bg-white/20 rounded-full px-3 py-1 inline-block">
                      Próximamente
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};