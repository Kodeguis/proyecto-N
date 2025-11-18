import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from './stores/appStoreDB';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { AdminLogin } from './components/auth/AdminLogin';
import { Menu } from './components/pages/Menu';
import { AdminPanel } from './components/pages/AdminPanel';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { Birthday2025 } from './components/pages/Birthday2025';
import { DailyMessages } from './components/pages/DailyMessages';
import { Trivia } from './components/pages/Trivia';
import { Coupons } from './components/pages/Coupons';
import { TriviaAdmin } from './components/admin/TriviaAdmin';
import { DailyMessagesAdmin } from './components/admin/DailyMessagesAdmin';
import { useEffect, useState } from 'react';

function App() {
  const currentPage = useStore((state) => state.currentPage);
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const isAdmin = useStore((state) => state.isAdmin);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'login':
        return <Login />;
      case 'register':
        return <Register />;
      case 'admin-login':
        return <AdminLogin />;
      case 'menu':
        return isAuthenticated ? <Menu /> : <Login />;
      case 'admin':
        return isAdmin ? <AdminPanel /> : <AdminLogin />;
      case 'trivia-admin':
        return isAdmin ? <TriviaAdmin /> : <AdminLogin />;
      case 'daily-messages-admin':
        return isAdmin ? <DailyMessagesAdmin /> : <AdminLogin />;
      case 'cumpleanos':
        return isAuthenticated ? <Birthday2025 /> : <Login />;
      case 'mensajes-diarios':
        return isAuthenticated ? <DailyMessages /> : <Login />;
      case 'trivia':
        return isAuthenticated ? <Trivia /> : <Login />;
      case 'cupones':
        return isAuthenticated ? <Coupons /> : <Login />;
      default:
        return <Login />;
    }
  };

  const pageVariants = {
    initial: { opacity: 0, scale: 0.9, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: -20 },
  };

  const pageTransition = {
    type: "spring" as const,
    stiffness: 100,
    damping: 20,
    duration: 0.6
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={pageTransition}
          className="min-h-screen"
        >
          {renderCurrentPage()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;
