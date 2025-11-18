import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, CalendarDays, Sparkles } from 'lucide-react';
import { useStore } from '../../stores/appStoreDB';
import { RomanticButton } from '../ui/RomanticButton';
import { AnimatedBackground } from '../ui/AnimatedBackground';
import { FloatingHearts } from '../ui/FloatingHearts';

interface DailyMessage {
  id: number;
  day: number;
  title: string;
  message: string;
  isUnlocked: boolean;
}

// Default messages as fallback
const defaultMessages: Omit<DailyMessage, 'isUnlocked'>[] = [
  {
    id: 1,
    day: 1,
    title: "Día 1: Mi Amor por Ti",
    message: "Cada día que despierto a tu lado es un regalo. Tu amor llena mi vida de colores que nunca antes había visto. Eres mi razón de ser."
  },
  {
    id: 2,
    day: 2,
    title: "Día 2: Tu Sonrisa",
    message: "Tu sonrisa es mi sol en los días nublados. Tiene el poder de alegrar incluso mis momentos más oscuros. Nunca dejes de sonreír."
  },
  {
    id: 3,
    day: 3,
    title: "Día 3: Nuestros Abrazos",
    message: "En tus abrazos encuentro mi hogar. Es el lugar más seguro y cálido del mundo. Cada abrazo nuestro es un viaje al cielo."
  },
  {
    id: 4,
    day: 4,
    title: "Día 4: Tu Inteligencia",
    message: "Me enamora tu mente brillante y tu forma de ver el mundo. Conversar contigo es descubrir nuevas perspectivas y aprender algo nuevo cada día."
  },
  {
    id: 5,
    day: 5,
    title: "Día 5: Tu Bondad",
    message: "Tu corazón generoso y tu alma bondadosa son cualidades que admiro profundamente. Haces del mundo un lugar mejor."
  },
  {
    id: 6,
    day: 6,
    title: "Día 6: Nuestras Risas",
    message: "Las risas que compartimos son mi música favorita. Contigo hasta los momentos simples se vuelven extraordinarios y llenos de alegría."
  },
  {
    id: 7,
    day: 7,
    title: "Día 7: Tu Fuerza",
    message: "Tu fuerza interior me inspira. Enfrentas cada desafío con valentía y determinación. Eres mi heroína en cada sentido."
  },
  {
    id: 8,
    day: 8,
    title: "Día 8: Nuestros Sueños",
    message: "Soñar contigo es mi actividad favorita. Juntos construimos castillos en el aire que algún día serán nuestro hogar real."
  },
  {
    id: 9,
    day: 9,
    title: "Día 9: Tu Pasión",
    message: "Tu pasión por la vida es contagiosa. Me enseñas a vivir cada momento con intensidad y a amar sin límites."
  },
  {
    id: 10,
    day: 10,
    title: "Día 10: Nuestro Futuro",
    message: "El futuro que imagino contigo es perfecto. Sé que juntos podemos superar cualquier obstáculo y alcanzar todas nuestras metas."
  },
  {
    id: 11,
    day: 11,
    title: "Día 11: Tu Ternura",
    message: "Tu ternura me derribe. Tiene el poder de suavizar mi corazón y hacerme sentir el hombre más afortunado del mundo."
  },
  {
    id: 12,
    day: 12,
    title: "Día 12: Nuestros Secretos",
    message: "Los secretos que compartimos son los tesoros más valiosos. Contigo puedo ser completamente yo mismo sin miedo a ser juzgado."
  },
  {
    id: 13,
    day: 13,
    title: "Día 13: Tu Belleza",
    message: "Tu belleza va más allá de lo físico. Brillas por tu esencia, tu alma luminosa y tu corazón de oro puro."
  },
  {
    id: 14,
    day: 14,
    title: "Día 14: Nuestros Silencios",
    message: "Incluso en el silencio, nuestros corazones hablan el mismo idioma. Los momentos de quietud contigo son profundamente significativos."
  },
  {
    id: 15,
    day: 15,
    title: "Día 15: Tu Alegría",
    message: "Tu alegría es mi medicina favorita. Tiene el poder de sanar mis heridas y llenar mi vida de luz y esperanza."
  },
  {
    id: 16,
    day: 16,
    title: "Día 16: Nuestras Aventuras",
    message: "Cada aventura contigo es épica. Desde los viajes más simples hasta los momentos más cotidianos, todo se vuelve extraordinario."
  },
  {
    id: 17,
    day: 17,
    title: "Día 17: Tu Sabiduría",
    message: "Tu sabiduría me guía. Tienes una forma única de ver la vida que me ayuda a crecer y convertirme en una mejor persona."
  },
  {
    id: 18,
    day: 18,
    title: "Día 18: Nuestros Abrazos",
    message: "Cada abrazo nuestro es un poema sin palabras. Es la forma más bella de decir 'te amo' sin pronunciar una sola palabra."
  },
  {
    id: 19,
    day: 19,
    title: "Día 19: Tu Perseverancia",
    message: "Tu perseverancia me inspira. Nunca te rindes y siempre encuentras la forma de superar los obstáculos con gracia y determinación."
  },
  {
    id: 20,
    day: 20,
    title: "Día 20: Nuestro Amor",
    message: "Nuestro amor es único y especial. Es un fuego que nunca se apaga, un océano sin fondo, un cielo sin límites. Te amo más allá de las palabras."
  },
  {
    id: 21,
    day: 21,
    title: "Día 21: Tu Esencia",
    message: "Tu esencia es mi aroma favorito. Tiene el poder de transportarme a los momentos más felices de mi vida: todos contigo."
  },
  {
    id: 22,
    day: 22,
    title: "Día 22: Nuestros Sueños",
    message: "Los sueños que construimos juntos son la base de nuestro futuro. Cada uno es un ladrillo en el castillo de nuestro amor eterno."
  },
  {
    id: 23,
    day: 23,
    title: "Día 23: Tu Magia",
    message: "Tienes una magia especial que transforma lo ordinario en extraordinario. Contigo, cada día es una aventura llena de maravillas."
  },
  {
    id: 24,
    day: 24,
    title: "Día 24: Nuestra Conexión",
    message: "Nuestra conexión va más allá de lo físico. Es una unión espiritual que trasciende el tiempo y el espacio. Somos almas gemelas."
  },
  {
    id: 25,
    day: 25,
    title: "Día 25: Tu Luz",
    message: "Eres mi luz en la oscuridad. Tu presencia ilumina incluso los días más nublados y llena mi vida de esperanza y alegría."
  },
  {
    id: 26,
    day: 26,
    title: "Día 26: Nuestros Momentos",
    message: "Cada momento contigo es un diamante en el collar de nuestra historia. Juntos hemos creado un tesoro invaluable de recuerdos."
  },
  {
    id: 27,
    day: 27,
    title: "Día 27: Tu Amor",
    message: "Tu amor es el regalo más precioso que he recibido. Es un tesoro que guardaré en mi corazón por el resto de mi vida."
  },
  {
    id: 28,
    day: 28,
    title: "Día 28: Nuestro Viaje",
    message: "Nuestro viaje juntos es mi aventura favorita. Cada día es una nueva página en el libro más hermoso jamás escrito: nuestra historia de amor."
  },
  {
    id: 29,
    day: 29,
    title: "Día 29: Tu Presencia",
    message: "Tu presencia en mi vida es un regalo del cielo. Cada día agradezco el universo por cruzar nuestros caminos y permitirme amarte."
  },
  {
    id: 30,
    day: 30,
    title: "Día 30: Nuestro Eterno Amor",
    message: "Este es solo el comienzo de nuestro amor eterno. Prometo amarte, cuidarte y respetarte cada día de mi vida. Eres mi todo, mi hoy y mi siempre."
  }
];

export const DailyMessages: React.FC = () => {
  const [messages, setMessages] = useState<DailyMessage[]>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const userData = useStore((state) => state.userData);
  const openDay = useStore((state) => state.openDay);
  const setCurrentPage = useStore((state) => state.setCurrentPage);

  useEffect(() => {
    // Load custom messages from localStorage or use defaults
    const loadMessages = () => {
      try {
        const customMessages = localStorage.getItem('customDailyMessages');
        const messageData = customMessages ? JSON.parse(customMessages) : defaultMessages;
        
        // Initialize messages with unlocked status based on user data
        const initializedMessages = messageData.map((msg: any) => ({
          ...msg,
          isUnlocked: userData.openedDays.includes(msg.day)
        }));
        setMessages(initializedMessages);
      } catch (error) {
        console.error('Error loading messages:', error);
        // Fallback to default messages if there's an error
        const initializedMessages = defaultMessages.map(msg => ({
          ...msg,
          isUnlocked: userData.openedDays.includes(msg.day)
        }));
        setMessages(initializedMessages);
      }
    };
    
    loadMessages();
  }, [userData.openedDays]);

  const handleDayClick = async (day: number) => {
    const message = messages.find(m => m.day === day);
    if (message) {
      if (!message.isUnlocked) {
        // Unlock the message for free
        await openDay(day);
      }
      setSelectedDay(day);
      setShowMessage(true);
    }
  };

  const handleGoBack = () => {
    setCurrentPage('menu');
  };

  const closeMessage = () => {
    setShowMessage(false);
    setSelectedDay(null);
  };

  const selectedMessage = messages.find(m => m.day === selectedDay);
  const unlockedCount = messages.filter(m => m.isUnlocked).length;

  return (
    <div className="min-h-screen bg-romantic-gradient bg-[length:400%_400%] animate-gradient-shift relative overflow-hidden">
      <AnimatedBackground />
      <FloatingHearts />
      
      {/* Header */}
      <div className="relative z-20 p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
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
              Mensajes Diarios 💌
            </h1>
            <p className="text-white/80 text-sm">
              {unlockedCount} / {messages.length} mensajes leídos
            </p>
          </div>
          <div className="w-24"></div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="relative z-10 max-w-6xl mx-auto p-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-romantic">
          <div className="grid grid-cols-5 md:grid-cols-6 gap-3 mb-6">
            {messages.map((message) => (
              <motion.div
                key={message.day}
                whileHover={{ scale: message.isUnlocked ? 1.05 : 1.02 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  aspect-square rounded-2xl flex flex-col items-center justify-center text-center p-2 cursor-pointer transition-all duration-300
                  ${
                    message.isUnlocked
                      ? 'bg-gradient-to-br from-pink-400 to-rose-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 border-2 border-dashed border-gray-300 hover:border-pink-300 hover:bg-pink-50'
                  }
                `}
                onClick={() => handleDayClick(message.day)}
              >
                <div className="text-lg font-bold">{message.day}</div>
                <div className="text-xs opacity-80">
                  {message.isUnlocked ? '✨' : <Sparkles className="w-3 h-3 mx-auto" />}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Instructions */}
          <div className="text-center text-gray-600 text-sm">
            <p>💝 Todos los mensajes son gratuitos y llenos de amor</p>
            <p className="mt-2">Haz clic en cualquier día para leer el mensaje</p>
          </div>
        </div>
      </div>

      {/* Message Modal */}
      <AnimatePresence>
        {showMessage && selectedMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeMessage}
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
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-gradient-to-br from-pink-400 to-rose-500 p-3 rounded-full text-white">
                    <CalendarDays className="w-8 h-8" />
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-romantic-pink mb-2">
                  {selectedMessage.title}
                </h2>
                
                <p className="text-gray-700 leading-relaxed mb-6">
                  {selectedMessage.message}
                </p>
                
                <div className="flex items-center justify-center text-sm text-gray-500 mb-4">
                  <Heart className="w-4 h-4 mr-2 text-romantic-pink" />
                  Mensaje de amor gratuito
                </div>
                
                <RomanticButton onClick={closeMessage} fullWidth>
                  Cerrar 💕
                </RomanticButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};