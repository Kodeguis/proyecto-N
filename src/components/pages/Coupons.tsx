import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Gift, Clock, CheckCircle, Lock } from 'lucide-react';
import { useStore } from '../../stores/appStoreDB';
import { RomanticButton } from '../ui/RomanticButton';
import { AnimatedBackground } from '../ui/AnimatedBackground';
import { FloatingHearts } from '../ui/FloatingHearts';

interface Coupon {
  id: number;
  title: string;
  description: string;
  cost: number;
  icon: React.ReactNode;
  category: 'romantic' | 'fun' | 'special' | 'adventure';
  isUnlocked: boolean;
  isUsed: boolean;
  validUntil?: string;
}

const couponsData: Omit<Coupon, 'isUnlocked' | 'isUsed'>[] = [
  {
    id: 1,
    title: "Abrazo Eterno",
    description: "Un abrazo que dura tanto como quieras. Prometo no soltarte hasta que estés completamente segura de mi amor.",
    cost: 50,
    icon: <Heart className="w-6 h-6" />,
    category: 'romantic',
    validUntil: "2025-12-31"
  },
  {
    id: 2,
    title: "Cena Romántica",
    description: "Te prepararé tu cena favorita con velas, música suave y mucho amor. Incluye postre sorpresa.",
    cost: 100,
    icon: <Gift className="w-6 h-6" />,
    category: 'romantic',
    validUntil: "2025-12-31"
  },
  {
    id: 3,
    title: "Día de Spa en Casa",
    description: "Masaje relajante, baño con sales aromáticas, velas y música zen. Te mereces ser consentida como una reina.",
    cost: 150,
    icon: <Heart className="w-6 h-6" />,
    category: 'special',
    validUntil: "2025-12-31"
  },
  {
    id: 4,
    title: "Película y Palomitas",
    description: "Maratón de tus películas favoritas con palomitas, snacks y muchas risas juntos en el sofá.",
    cost: 75,
    icon: <Gift className="w-6 h-6" />,
    category: 'fun',
    validUntil: "2025-12-31"
  },
  {
    id: 5,
    title: "Desayuno en la Cama",
    description: "Te llevaré desayuno a la cama con tus alimentos favoritos, frutas frescas y jugo recién exprimido.",
    cost: 80,
    icon: <Heart className="w-6 h-6" />,
    category: 'romantic',
    validUntil: "2025-12-31"
  },
  {
    id: 6,
    title: "Paseo Nocturno",
    description: "Un paseo bajo las estrellas, tomados de la mano, compartiendo sueños y abrazándonos contra el frío.",
    cost: 60,
    icon: <Clock className="w-6 h-6" />,
    category: 'romantic',
    validUntil: "2025-12-31"
  },
  {
    id: 7,
    title: "Día de Aventura",
    description: "Exploraremos un lugar nuevo juntos, creando memorias inolvidables y compartiendo momentos únicos.",
    cost: 120,
    icon: <Gift className="w-6 h-6" />,
    category: 'adventure',
    validUntil: "2025-12-31"
  },
  {
    id: 8,
    title: "Noche de Juegos",
    description: "Juegos de mesa, videojuegos o cartas. Competiremos, reiremos y nos divertiremos como niños otra vez.",
    cost: 70,
    icon: <Gift className="w-6 h-6" />,
    category: 'fun',
    validUntil: "2025-12-31"
  },
  {
    id: 9,
    title: "Masaje Relajante",
    description: "Masaje de cuerpo completo para aliviar tu estrés y hacerte sentir completamente relajada y amada.",
    cost: 90,
    icon: <Heart className="w-6 h-6" />,
    category: 'special',
    validUntil: "2025-12-31"
  },
  {
    id: 10,
    title: "Día de Compras",
    description: "Te acompañaré de compras y te ayudaré a elegir lo que más te guste. Mi opinión honesta y mi apoyo incondicional.",
    cost: 110,
    icon: <Gift className="w-6 h-6" />,
    category: 'special',
    validUntil: "2025-12-31"
  },
  {
    id: 11,
    title: "Canción Dedicada",
    description: "Te cantaré tu canción favorita o compartiré una playlist especial mientras miramos las estrellas juntos.",
    cost: 40,
    icon: <Heart className="w-6 h-6" />,
    category: 'romantic',
    validUntil: "2025-12-31"
  },
  {
    id: 12,
    title: "Día sin Quejas",
    description: "Durante 24 horas no quejaré de nada y estaré de buen humor. Prometo sonreír y ser positivo todo el día.",
    cost: 85,
    icon: <CheckCircle className="w-6 h-6" />,
    category: 'fun',
    validUntil: "2025-12-31"
  }
];

export const Coupons: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [filter, setFilter] = useState<'all' | 'romantic' | 'fun' | 'special' | 'adventure'>('all');
  
  const userData = useStore((state) => state.userData);
  const unlockCoupon = useStore((state) => state.unlockCoupon);
  const useCoupon = useStore((state) => state.useCoupon);
  const setCurrentPage = useStore((state) => state.setCurrentPage);

  useEffect(() => {
    // Initialize coupons with unlocked and used status
    const initializedCoupons = couponsData.map(coupon => ({
      ...coupon,
      isUnlocked: userData.unlockedCoupons.includes(coupon.id),
      isUsed: userData.usedCoupons.includes(coupon.id)
    }));
    setCoupons(initializedCoupons);
  }, [userData.unlockedCoupons, userData.usedCoupons]);

  const handleUnlockCoupon = (coupon: Coupon) => {
    if (userData.points >= coupon.cost && !coupon.isUnlocked) {
      setSelectedCoupon(coupon);
      setShowConfirmation(true);
    }
  };

  const confirmUnlock = () => {
    if (selectedCoupon) {
      unlockCoupon(selectedCoupon.id);
      setShowConfirmation(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleUseCoupon = async (coupon: Coupon) => {
    if (coupon.isUnlocked && !coupon.isUsed) {
      const success = await useCoupon(coupon.id);
      if (success) {
        // Aquí podrías agregar lógica adicional para "usar" el cupón
        alert(`¡Cupón "${coupon.title}" utilizado! 🎉\n\n${coupon.description}`);
      } else {
        alert('Error al usar el cupón. Por favor intenta de nuevo.');
      }
    }
  };

  const filteredCoupons = coupons.filter(coupon => {
    if (filter === 'all') return true;
    return coupon.category === filter;
  });

  const handleGoBack = () => {
    setCurrentPage('menu');
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'romantic': return 'from-pink-400 to-rose-500';
      case 'fun': return 'from-purple-400 to-blue-500';
      case 'special': return 'from-yellow-400 to-orange-500';
      case 'adventure': return 'from-green-400 to-teal-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'romantic': return <Heart className="w-4 h-4" />;
      case 'fun': return <Gift className="w-4 h-4" />;
      case 'special': return <CheckCircle className="w-4 h-4" />;
      case 'adventure': return <Clock className="w-4 h-4" />;
      default: return <Gift className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-romantic-gradient bg-[length:400%_400%] animate-gradient-shift relative overflow-hidden">
      <AnimatedBackground />
      <FloatingHearts />
      
      {/* Header */}
      <div className="relative z-20 p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto mb-4">
          <RomanticButton
            onClick={handleGoBack}
            variant="secondary"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Menú
          </RomanticButton>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white text-shadow-lg">
              Cupones de Amor 🎫
            </h1>
            <p className="text-white/80 text-sm">
              Tienes {userData.points} puntos disponibles
            </p>
          </div>
          <div className="w-24"></div>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center gap-2 mb-6">
          {['all', 'romantic', 'fun', 'special', 'adventure'].map((cat) => (
            <RomanticButton
              key={cat}
              onClick={() => setFilter(cat as any)}
              variant={filter === cat ? 'primary' : 'secondary'}
              size="sm"
            >
              {cat === 'all' ? 'Todos' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </RomanticButton>
          ))}
        </div>
      </div>

      {/* Coupons Grid */}
      <div className="relative z-10 max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCoupons.map((coupon) => (
            <motion.div
              key={coupon.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`
                bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-romantic
                ${coupon.isUsed ? 'opacity-60' : ''}
                ${!coupon.isUnlocked && userData.points < coupon.cost ? 'opacity-50' : ''}
              `}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className={`bg-gradient-to-br ${getCategoryColor(coupon.category)} p-2 rounded-full text-white`}>
                  {coupon.icon}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-romantic-pink">
                    {coupon.cost}
                  </div>
                  <div className="text-xs text-gray-500">puntos</div>
                </div>
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {coupon.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                {coupon.description}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  <div className="flex items-center">
                    {getCategoryIcon(coupon.category)}
                    <span className="ml-1 capitalize">{coupon.category}</span>
                  </div>
                  {coupon.validUntil && (
                    <div className="mt-1">
                      Válido hasta: {coupon.validUntil}
                    </div>
                  )}
                </div>

                <div>
                  {!coupon.isUnlocked ? (
                    <RomanticButton
                      onClick={() => handleUnlockCoupon(coupon)}
                      disabled={userData.points < coupon.cost}
                      size="sm"
                      variant="primary"
                    >
                      <Lock className="w-4 h-4 mr-1" />
                      Desbloquear
                    </RomanticButton>
                  ) : coupon.isUsed ? (
                    <div className="text-green-600 font-medium text-sm flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Usado
                    </div>
                  ) : (
                    <RomanticButton
                      onClick={() => handleUseCoupon(coupon)}
                      size="sm"
                      variant="secondary"
                    >
                      Usar cupón
                    </RomanticButton>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && selectedCoupon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowConfirmation(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-romantic"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">🎁</div>
                <h2 className="text-2xl font-bold text-romantic-pink mb-4">
                  ¿Desbloquear cupón?
                </h2>
                <p className="text-gray-600 mb-6">
                  Estás a punto de desbloquear "{selectedCoupon.title}" por {selectedCoupon.cost} puntos.
                </p>
                <div className="flex gap-3 justify-center">
                  <RomanticButton
                    onClick={() => setShowConfirmation(false)}
                    variant="secondary"
                  >
                    Cancelar
                  </RomanticButton>
                  <RomanticButton onClick={confirmUnlock}>
                    Desbloquear
                  </RomanticButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Message */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-2xl shadow-lg z-50"
          >
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 mr-2" />
              ¡Cupón desbloqueado exitosamente! 🎉
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};