import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Sparkles, Gift, Settings, TrendingUp, RefreshCw, Trophy, CalendarDays } from 'lucide-react';
import { RomanticButton } from '../ui/RomanticButton';
import { useStore } from '../../stores/appStoreDB';
import api from '../../lib/api';

export const AdminPanel = () => {
  const [pointsAdjust, setPointsAdjust] = useState('');
  const [activityLog, setActivityLog] = useState<string[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const userData = useStore((state) => state.userData);
  const setUserData = useStore((state) => state.setUserData);
  const addPoints = useStore((state) => state.addPoints);
  const adminUpdatePoints = useStore((state) => state.adminUpdatePoints);
  const setCurrentPage = useStore((state) => state.setCurrentPage);

  useEffect(() => {
    console.log('AdminPanel montado - versión con gestión de usuarios');
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const usersWithPoints = await api.authAPI.getAllUsersWithPoints();
      
      setUsers(usersWithPoints);
      if (usersWithPoints.length > 0 && !selectedUserId) {
        setSelectedUserId(usersWithPoints[0].id);
      }
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    }
  };

  const coupons = [
    { id: 1, icon: "☕", name: "Café" },
    { id: 2, icon: "🍿", name: "Películas" },
    { id: 3, icon: "📸", name: "Fotos" },
    { id: 4, icon: "🎮", name: "Juegos" },
    { id: 5, icon: "🍕", name: "Cena" },
    { id: 6, icon: "💆", name: "Masaje" },
    { id: 7, icon: "🍳", name: "Desayuno" },
    { id: 8, icon: "🎨", name: "Creativo" },
    { id: 9, icon: "🎵", name: "Karaoke" },
    { id: 10, icon: "🚗", name: "Paseo" },
    { id: 11, icon: "🎁", name: "Regalo" },
    { id: 12, icon: "💝", name: "Día Especial" }
  ];

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    setActivityLog(prev => [logEntry, ...prev].slice(0, 20));
  };

  const handleAdjustPoints = async () => {
    const adjustment = parseInt(pointsAdjust);
    if (isNaN(adjustment) || !selectedUserId) return;
    
    const success = await adminUpdatePoints(selectedUserId, adjustment);
    if (success) {
      addLog(`Puntos ajustados para usuario ${selectedUserId}: ${adjustment > 0 ? '+' : ''}${adjustment}`);
      // Recargar usuarios para reflejar cambios
      await loadUsers();
    } else {
      addLog(`Error al ajustar puntos para usuario ${selectedUserId}`);
    }
    setPointsAdjust('');
  };

  const handleResetPoints = () => {
    if (!confirm('¿Resetear puntos a 0?')) return;
    setUserData({ points: 0 });
    addLog('Puntos reseteados a 0');
  };

  const handleGiveBonus = () => {
    addPoints(50);
    addLog('Bonus de +50 puntos otorgado');
  };

  const handleResetAllCoupons = () => {
    if (!confirm('¿Resetear TODOS los cupones?')) return;
    setUserData({ unlockedCoupons: [], usedCoupons: [] });
    addLog('Todos los cupones reseteados');
  };

  const handleResetMessages = () => {
    if (!confirm('¿Resetear mensajes leídos?')) return;
    setUserData({ openedDays: [] });
    addLog('Mensajes diarios reseteados');
  };

  const handleResetEverything = () => {
    if (!confirm('⚠️ ¿RESETEAR ABSOLUTAMENTE TODO? Esta acción no se puede deshacer.')) return;
    setUserData({ 
      points: 0,
      unlockedCoupons: [],
      usedCoupons: [],
      openedDays: [],
      triviaScore: 0,
      triviaCompleted: []
    });
    addLog('⚠️ TODO reseteado - Datos completamente reiniciados');
  };

  const handleEditTrivia = () => {
    setCurrentPage('trivia-admin');
  };

  const handleEditDailyMessages = () => {
    setCurrentPage('daily-messages-admin');
  };

  const goBack = () => {
    setCurrentPage('menu');
  };

  return (
    <div className="min-h-screen bg-admin-gradient bg-[length:400%_400%] animate-gradient-shift p-4">
      {/* Header */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex justify-between items-center mb-6"
      >
        <button
          onClick={goBack}
          className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors bg-white/20 backdrop-blur-sm rounded-full px-4 py-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </button>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Settings className="w-8 h-8" />
          Panel de Administración
        </h1>
        <div className="w-20"></div>
      </motion.div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="lg:col-span-3"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg">
              <div className="text-4xl font-bold text-purple-600 mb-2">{userData.points}</div>
              <div className="text-gray-600 flex items-center justify-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Puntos Totales
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg">
              <div className="text-4xl font-bold text-green-600 mb-2">{userData.unlockedCoupons.length}</div>
              <div className="text-gray-600 flex items-center justify-center gap-2">
                <Gift className="w-4 h-4" />
                Cupones Desbloqueados
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg">
              <div className="text-4xl font-bold text-blue-600 mb-2">{userData.usedCoupons.length}</div>
              <div className="text-gray-600 flex items-center justify-center gap-2">
                <Heart className="w-4 h-4" />
                Cupones Usados
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg">
              <div className="text-4xl font-bold text-orange-600 mb-2">{userData.openedDays.length}</div>
              <div className="text-gray-600 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                Días Leídos
              </div>
            </div>
          </div>
        </motion.div>

        {/* Points Management */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Gestión de Puntos
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ajustar puntos manualmente:
              </label>
              <input
                type="number"
                value={pointsAdjust}
                onChange={(e) => setPointsAdjust(e.target.value)}
                placeholder="Cantidad (+ para sumar, - para restar)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex gap-2">
              <RomanticButton onClick={handleAdjustPoints} size="sm">
                Aplicar
              </RomanticButton>
              <RomanticButton onClick={handleResetPoints} variant="danger" size="sm">
                Resetear
              </RomanticButton>
              <RomanticButton onClick={handleGiveBonus} variant="success" size="sm">
                +50 Bonus
              </RomanticButton>
            </div>
          </div>
        </motion.div>

        {/* Coupons Status */}
        <motion.div
          initial={{ x: 0, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Gift className="w-5 h-5" />
            Estado de Cupones
          </h2>
          <div className="grid grid-cols-3 gap-3 mb-4 max-h-48 overflow-y-auto">
            {coupons.map((coupon) => {
              const isUnlocked = userData.unlockedCoupons.includes(coupon.id);
              const isUsed = userData.usedCoupons.includes(coupon.id);
              const status = isUsed ? 'USADO' : isUnlocked ? 'Desbloqueado' : 'Bloqueado';
              const bgColor = isUsed ? 'bg-red-100 border-red-300' : isUnlocked ? 'bg-green-100 border-green-300' : 'bg-gray-100 border-gray-300';
              
              return (
                <div key={coupon.id} className={`${bgColor} rounded-lg p-3 text-center border-2`}>
                  <div className="text-2xl mb-1">{coupon.icon}</div>
                  <div className="text-xs font-medium text-gray-700">{coupon.name}</div>
                  <div className="text-xs text-gray-500">{status}</div>
                </div>
              );
            })}
          </div>
          <RomanticButton onClick={handleResetAllCoupons} variant="danger" size="sm" fullWidth>
            <RefreshCw className="w-4 h-4 mr-2" />
            Resetear Todos
          </RomanticButton>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Acciones Rápidas
          </h2>
          <div className="space-y-3">
            <RomanticButton onClick={handleEditTrivia} variant="primary" size="sm" fullWidth>
              <Trophy className="w-4 h-4 mr-2" />
              Editar Preguntas Trivia
            </RomanticButton>
            <RomanticButton onClick={handleEditDailyMessages} variant="primary" size="sm" fullWidth>
              <CalendarDays className="w-4 h-4 mr-2" />
              Editar Mensajes Diarios
            </RomanticButton>
            <RomanticButton onClick={handleResetMessages} variant="warning" size="sm" fullWidth>
              Resetear Mensajes
            </RomanticButton>
            <RomanticButton onClick={handleResetEverything} variant="danger" size="sm" fullWidth>
              ⚠️ RESETEAR TODO
            </RomanticButton>
          </div>
        </motion.div>

        {/* Activity Log */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="lg:col-span-3 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Log de Actividad
          </h2>
          <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
            {activityLog.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                No hay actividad reciente
              </div>
            ) : (
              <div className="space-y-2">
                {activityLog.map((log, index) => (
                  <div key={index} className="text-sm text-gray-700 py-1 border-b border-gray-200 last:border-b-0">
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};