import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, RefreshCw, CalendarDays, Heart } from 'lucide-react';
import { RomanticButton } from '../ui/RomanticButton';
import { useStore } from '../../stores/appStore';

interface EditableMessage {
  id: number;
  day: number;
  title: string;
  message: string;
}

// Default messages as fallback
const defaultMessages = [
  { id: 1, day: 1, title: "Día 1: Mi Amor por Ti", message: "Cada día que despierto a tu lado es un regalo. Tu amor llena mi vida de colores que nunca antes había visto. Eres mi razón de ser." },
  { id: 2, day: 2, title: "Día 2: Tu Sonrisa", message: "Tu sonrisa es mi sol en los días nublados. Tiene el poder de alegrar incluso mis momentos más oscuros. Nunca dejes de sonreír." },
  { id: 3, day: 3, title: "Día 3: Nuestros Abrazos", message: "En tus abrazos encuentro mi hogar. Es el lugar más seguro y cálido del mundo. Cada abrazo nuestro es un viaje al cielo." },
  { id: 4, day: 4, title: "Día 4: Tu Inteligencia", message: "Me enamora tu mente brillante y tu forma de ver el mundo. Conversar contigo es descubrir nuevas perspectivas y aprender algo nuevo cada día." },
  { id: 5, day: 5, title: "Día 5: Tu Bondad", message: "Tu corazón generoso y tu alma bondadosa son cualidades que admiro profundamente. Haces del mundo un lugar mejor." },
  { id: 6, day: 6, title: "Día 6: Nuestras Risas", message: "Las risas que compartimos son mi música favorita. Contigo hasta los momentos simples se vuelven extraordinarios y llenos de alegría." },
  { id: 7, day: 7, title: "Día 7: Tu Fuerza", message: "Tu fuerza interior me inspira. Enfrentas cada desafío con valentía y determinación. Eres mi heroína en cada sentido." },
  { id: 8, day: 8, title: "Día 8: Nuestros Sueños", message: "Soñar contigo es mi actividad favorita. Juntos construimos castillos en el aire que algún día serán nuestro hogar real." },
  { id: 9, day: 9, title: "Día 9: Tu Pasión", message: "Tu pasión por la vida es contagiosa. Me enseñas a vivir cada momento con intensidad y a amar sin límites." },
  { id: 10, day: 10, title: "Día 10: Nuestro Futuro", message: "El futuro que imagino contigo es perfecto. Sé que juntos podemos superar cualquier obstáculo y alcanzar todas nuestras metas." },
  { id: 11, day: 11, title: "Día 11: Tu Ternura", message: "Tu ternura me derribe. Tiene el poder de suavizar mi corazón y hacerme sentir el hombre más afortunado del mundo." },
  { id: 12, day: 12, title: "Día 12: Nuestros Secretos", message: "Los secretos que compartimos son los tesoros más valiosos. Contigo puedo ser completamente yo mismo sin miedo a ser juzgado." },
  { id: 13, day: 13, title: "Día 13: Tu Belleza", message: "Tu belleza va más allá de lo físico. Brillas por tu esencia, tu alma luminosa y tu corazón de oro puro." },
  { id: 14, day: 14, title: "Día 14: Nuestros Silencios", message: "Incluso en el silencio, nuestros corazones hablan el mismo idioma. Los momentos de quietud contigo son profundamente significativos." },
  { id: 15, day: 15, title: "Día 15: Tu Alegría", message: "Tu alegría es mi medicina favorita. Tiene el poder de sanar mis heridas y llenar mi vida de luz y esperanza." },
  { id: 16, day: 16, title: "Día 16: Nuestras Aventuras", message: "Cada aventura contigo es épica. Desde los viajes más simples hasta los momentos más cotidianos, todo se vuelve extraordinario." },
  { id: 17, day: 17, title: "Día 17: Tu Sabiduría", message: "Tu sabiduría me guía. Tienes una forma única de ver la vida que me ayuda a crecer y convertirme en una mejor persona." },
  { id: 18, day: 18, title: "Día 18: Nuestros Abrazos", message: "Cada abrazo nuestro es un poema sin palabras. Es la forma más bella de decir 'te amo' sin pronunciar una sola palabra." },
  { id: 19, day: 19, title: "Día 19: Tu Perseverancia", message: "Tu perseverancia me inspira. Nunca te rindes y siempre encuentras la forma de superar los obstáculos con gracia y determinación." },
  { id: 20, day: 20, title: "Día 20: Nuestro Amor", message: "Nuestro amor es único y especial. Es un fuego que nunca se apaga, un océano sin fondo, un cielo sin límites. Te amo más allá de las palabras." },
  { id: 21, day: 21, title: "Día 21: Tu Esencia", message: "Tu esencia es mi aroma favorito. Tiene el poder de transportarme a los momentos más felices de mi vida: todos contigo." },
  { id: 22, day: 22, title: "Día 22: Nuestros Sueños", message: "Los sueños que construimos juntos son la base de nuestro futuro. Cada uno es un ladrillo en el castillo de nuestro amor eterno." },
  { id: 23, day: 23, title: "Día 23: Tu Magia", message: "Tienes una magia especial que transforma lo ordinario en extraordinario. Contigo, cada día es una aventura llena de maravillas." },
  { id: 24, day: 24, title: "Día 24: Nuestra Conexión", message: "Nuestra conexión va más allá de lo físico. Es una unión espiritual que trasciende el tiempo y el espacio. Somos almas gemelas." },
  { id: 25, day: 25, title: "Día 25: Tu Luz", message: "Eres mi luz en la oscuridad. Tu presencia ilumina incluso los días más nublados y llena mi vida de esperanza y alegría." },
  { id: 26, day: 26, title: "Día 26: Nuestros Momentos", message: "Cada momento contigo es un diamante en el collar de nuestra historia. Juntos hemos creado un tesoro invaluable de recuerdos." },
  { id: 27, day: 27, title: "Día 27: Tu Amor", message: "Tu amor es el regalo más precioso que he recibido. Es un tesoro que guardaré en mi corazón por el resto de mi vida." },
  { id: 28, day: 28, title: "Día 28: Nuestro Viaje", message: "Nuestro viaje juntos es mi aventura favorita. Cada día es una nueva página en el libro más hermoso jamás escrito: nuestra historia de amor." },
  { id: 29, day: 29, title: "Día 29: Tu Presencia", message: "Tu presencia en mi vida es un regalo del cielo. Cada día agradezco el universo por cruzar nuestros caminos y permitirme amarte." },
  { id: 30, day: 30, title: "Día 30: Nuestro Eterno Amor", message: "Este es solo el comienzo de nuestro amor eterno. Prometo amarte, cuidarte y respetarte cada día de mi vida. Eres mi todo, mi hoy y mi siempre." }
];

export const DailyMessagesAdmin: React.FC = () => {
  const [messages, setMessages] = useState<EditableMessage[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const setCurrentPage = useStore((state) => state.setCurrentPage);

  useEffect(() => {
    // Load messages from localStorage or use defaults
    const savedMessages = localStorage.getItem('customDailyMessages');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (error) {
        console.error('Error loading saved messages:', error);
        setMessages(defaultMessages);
      }
    } else {
      setMessages(defaultMessages);
    }
  }, []);

  const handleTitleChange = (day: number, newTitle: string) => {
    setMessages(prev => prev.map(msg => 
      msg.day === day ? { ...msg, title: newTitle } : msg
    ));
    setHasChanges(true);
  };

  const handleMessageChange = (day: number, newMessage: string) => {
    setMessages(prev => prev.map(msg => 
      msg.day === day ? { ...msg, message: newMessage } : msg
    ));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    // Simulate saving delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Save to localStorage
    localStorage.setItem('customDailyMessages', JSON.stringify(messages));
    
    setHasChanges(false);
    setIsLoading(false);
    
    // Show success message
    alert('¡Mensajes guardados exitosamente! 💝');
  };

  const handleReset = () => {
    if (confirm('¿Estás seguro de que quieres restablecer todos los mensajes a los valores predeterminados?')) {
      setMessages(defaultMessages);
      setHasChanges(true);
    }
  };

  const handleGoBack = () => {
    if (hasChanges && !confirm('¿Deseas salir sin guardar los cambios?')) {
      return;
    }
    setCurrentPage('admin');
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
          onClick={handleGoBack}
          className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors bg-white/20 backdrop-blur-sm rounded-full px-4 py-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </button>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <CalendarDays className="w-8 h-8" />
          Editor de Mensajes Diarios
        </h1>
        <div className="flex gap-2">
          <RomanticButton
            onClick={handleReset}
            variant="secondary"
            size="sm"
            disabled={isLoading}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Restablecer
          </RomanticButton>
          <RomanticButton
            onClick={handleSave}
            variant="primary"
            size="sm"
            loading={isLoading}
            disabled={!hasChanges}
          >
            <Save className="w-4 h-4 mr-2" />
            Guardar
          </RomanticButton>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto">
        {/* Status Bar */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-pink-500" />
              <span className="text-gray-700">
                {messages.length} mensajes configurados
              </span>
            </div>
            {hasChanges && (
              <div className="text-orange-600 text-sm font-medium">
                ⚠️ Tienes cambios sin guardar
              </div>
            )}
          </div>
        </motion.div>

        {/* Messages Editor */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Editar Mensajes Diarios
          </h2>
          
          <div className="space-y-6 max-h-[60vh] overflow-y-auto">
            {messages.map((message, index) => (
              <motion.div
                key={message.day}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index, duration: 0.4 }}
                className="border border-gray-200 rounded-xl p-4 hover:border-pink-300 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    {message.day}
                  </div>
                  <h3 className="font-semibold text-gray-800">Día {message.day}</h3>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Título:
                    </label>
                    <input
                      type="text"
                      value={message.title}
                      onChange={(e) => handleTitleChange(message.day, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Título del mensaje"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mensaje:
                    </label>
                    <textarea
                      value={message.message}
                      onChange={(e) => handleMessageChange(message.day, e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                      placeholder="Escribe tu mensaje de amor aquí..."
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-6 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-3">
            💡 Instrucciones
          </h3>
          <ul className="text-gray-600 space-y-2 text-sm">
            <li>• Haz clic en cualquier campo para editar el título o mensaje</li>
            <li>• Los cambios se guardan automáticamente en el navegador</li>
            <li>• Usa el botón "Restablecer" para volver a los mensajes predeterminados</li>
            <li>• Los mensajes se mostrarán en el orden de los días (1-30)</li>
            <li>• Todos los mensajes son gratuitos para el usuario</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};