import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Sparkles } from 'lucide-react';
import { useStore } from '../../stores/appStore';
import { RomanticButton } from '../ui/RomanticButton';
import { AnimatedBackground } from '../ui/AnimatedBackground';

interface Memory {
  id: number;
  image: string;
  caption: string;
}

const memories: Memory[] = [
  {
    id: 1,
    image: "/images/foto1.jpg",
    caption: "Nuestro día de basket sintiendo esa sinergia y emoción de jugar a tu lado 💕"
  },
  {
    id: 2,
    image: "/images/foto2.jpg",
    caption: "En cualquier lado y en cualquier solución mi mano y mis ganas me delatan jajaja 😄"
  },
  {
    id: 3,
    image: "/images/foto3.jpg",
    caption: "Nuestro primer café juntos 😊"
  },
  {
    id: 4,
    image: "/images/foto4.jpg",
    caption: "Momentos que atesoro en mi corazón y sé que ellas también 💖"
  },
  {
    id: 5,
    image: "/images/foto5.jpg",
    caption: "Acompañándote en tus logros ✨"
  },
  {
    id: 6,
    image: "/images/foto6.jpg",
    caption: "Hay un poco de boca en mi labial jajaja 💋"
  },
  {
    id: 7,
    image: "/images/foto7.jpg",
    caption: "Simplemente nosotros 💑"
  },
  {
    id: 8,
    image: "/images/foto8.jpg",
    caption: "Me divierto mucho a tu lado 😄"
  },
  {
    id: 9,
    image: "/images/foto9.jpg",
    caption: "Mi jugadora favorita 💝"
  },
  {
    id: 10,
    image: "/images/foto10.jpg",
    caption: "Mi persona favorita 🥰"
  },
  {
    id: 11,
    image: "/images/foto11.jpg",
    caption: "Quizá no lo digo mucho pero me encantan tus ojos 💖"
  },
  {
    id: 12,
    image: "/images/foto12.jpg",
    caption: "Marcado de por vida 💪"
  },
  {
    id: 13,
    image: "/images/foto13.jpg",
    caption: "Por muchos más momentos así 💞"
  }
];

export const Birthday2025: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showLetter, setShowLetter] = useState(false);
  const [letterRead, setLetterRead] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Memory | null>(null);
  const setCurrentPage = useStore((state) => state.setCurrentPage);

  useEffect(() => {
    console.log('=== BIRTHDAY2025: Componente montado ===');
    console.log('setCurrentPage obtenido del store:', typeof setCurrentPage);
    console.log('Función completa:', setCurrentPage);
    
    // Log del estado completo del store
    const storeState = useStore.getState();
    console.log('Estado completo del store:', storeState);
    console.log('Funciones disponibles en store:', Object.keys(storeState));
  }, []);

  const handleStart = () => {
    setCurrentStep(2);
  };

  const handleEnvelopeClick = () => {
    setShowLetter(true);
  };

  const handleCloseLetter = () => {
    setShowLetter(false);
    setLetterRead(true);
  };

  const handleShowGallery = () => {
    setCurrentStep(3);
  };

  const handlePhotoClick = (photo: Memory) => {
    setSelectedPhoto(photo);
  };

  const handleClosePhoto = () => {
    setSelectedPhoto(null);
  };

  const handleGoBack = () => {
    console.log('=== BIRTHDAY2025: handleGoBack llamado ===');
    console.log('setCurrentPage disponible:', typeof setCurrentPage);
    console.log('Antes de setCurrentPage - currentStep:', currentStep);
    
    try {
      // Método principal: usar setCurrentPage directamente
      console.log('Intentando método 1: setCurrentPage directo');
      setCurrentPage('menu');
      
      // Verificar que el cambio se aplicó
      setTimeout(() => {
        const store = useStore.getState();
        console.log('Estado después de navegación:', store.currentPage);
        
        // Si no cambió, intentar método de respaldo
        if (store.currentPage !== 'menu') {
          console.log('⚠️ Navegación no funcionó, intentando método de respaldo');
          store.setCurrentPage('menu');
        }
      }, 100);
      
      console.log('✅ setCurrentPage(\"menu\") ejecutado exitosamente');
    } catch (error) {
      console.error('❌ Error en setCurrentPage:', error);
      
      // Método de emergencia: forzar con window.location
      console.log('Intentando método de emergencia: window.location');
      // window.location.href = '/'; // Descomentar si todo falla
    }
  };

  const handleBackToPanel2 = () => {
    setCurrentStep(2);
  };

  return (
    <div className="min-h-screen bg-romantic-gradient bg-[length:400%_400%] animate-gradient-shift relative overflow-hidden">
      <AnimatedBackground />
      
      {/* Navigation Buttons - MOVIDO A LA DERECHA */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <RomanticButton
          onClick={() => {
            console.log('=== BOTÓN MENÚ PRINCIPAL CLICADO ===');
            handleGoBack();
          }}
          variant="secondary"
          size="sm"
          className="bg-white/90 backdrop-blur-sm border-2 border-white/30 shadow-lg hover:shadow-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Menú Principal
        </RomanticButton>
      </div>

      {currentStep === 3 && (
        <div className="fixed top-4 left-20 z-50">
          <RomanticButton
            onClick={handleBackToPanel2}
            variant="secondary"
            size="sm"
          >
            ←
          </RomanticButton>
        </div>
      )}

      {/* Panel 1 - Welcome */}
      <AnimatePresence>
        {currentStep === 1 && (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10"
          >
            {/* Corner Hearts */}
            <div className="absolute top-5 left-5 text-4xl animate-pulse">💖</div>
            <div className="absolute top-5 right-5 text-4xl animate-pulse" style={{ animationDelay: '0.5s' }}>💗</div>
            <div className="absolute bottom-10 left-10 text-4xl animate-pulse" style={{ animationDelay: '1s' }}>💕</div>
            <div className="absolute bottom-10 right-10 text-4xl animate-pulse" style={{ animationDelay: '1.5s' }}>💓</div>

            <div className="text-center max-w-2xl">
              <motion.h1
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-5xl md:text-6xl font-bold text-romantic-pink mb-8 text-shadow-lg animate-pulse"
              >
                ¡Feliz cumpleaños, mi amor! 💖
              </motion.h1>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-xl text-gray-700 mb-12 leading-relaxed"
              >
                Este regalo es para ti, con todo mi corazón. Espero que te guste tanto como yo disfruto cada momento a tu lado.
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <RomanticButton
                  onClick={handleStart}
                  size="lg"
                  className="text-xl px-8 py-4"
                >
                  Empezar ✨
                </RomanticButton>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panel 2 - Letter */}
      <AnimatePresence>
        {currentStep === 2 && (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10"
          >
            {/* Corner Hearts */}
            <div className="absolute top-8 left-8 text-3xl animate-pulse">💝</div>
            <div className="absolute bottom-15 right-12 text-3xl animate-pulse" style={{ animationDelay: '0.7s' }}>💞</div>

            <div className="text-center max-w-2xl">
              <motion.h1
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-4xl md:text-5xl font-bold text-romantic-pink mb-6 text-shadow-lg"
              >
                💌 Una carta para ti
              </motion.h1>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-lg text-gray-700 mb-12"
              >
                Haz clic en el sobre para leer mi mensaje 💕
              </motion.p>

              {/* Envelope */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6, type: "spring" }}
                whileHover={{ scale: 1.1, rotate: 2 }}
                className="relative w-80 h-52 bg-pink-300 rounded-lg shadow-romantic cursor-pointer mx-auto mb-8"
                onClick={handleEnvelopeClick}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-pink-400 rounded-lg" />
                <div className="absolute top-0 left-0 w-full h-full">
                  <div className="w-full h-full bg-gradient-to-br from-pink-300 to-pink-500 rounded-lg" 
                       style={{ clipPath: 'polygon(0 0, 50% 50%, 100% 0)' }} />
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl">
                  💌
                </div>
              </motion.div>

              {/* Gallery Button - appears after reading letter */}
              <AnimatePresence>
                {letterRead && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: 0.2 }}
                  >
                    <RomanticButton
                      onClick={handleShowGallery}
                      size="lg"
                      className="text-lg px-6 py-3"
                    >
                      Ver galería de recuerdos 📸
                    </RomanticButton>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panel 3 - Gallery */}
      <AnimatePresence>
        {currentStep === 3 && (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="min-h-screen p-4 relative z-10"
          >
            {/* Corner Heart */}
            <div className="absolute top-15 right-8 text-3xl animate-pulse">💗</div>

            <div className="max-w-6xl mx-auto">
              <motion.h1
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-4xl md:text-5xl font-bold text-romantic-pink mb-12 text-center text-shadow-lg"
              >
                Nuestros recuerdos 💞
              </motion.h1>

              {/* Gallery Grid */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12"
              >
                {memories.map((memory, index) => (
                  <motion.div
                    key={memory.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                    whileHover={{ 
                      scale: 1.05, 
                      rotate: 2,
                      transition: { duration: 0.3 }
                    }}
                    className="bg-white rounded-2xl shadow-lg cursor-pointer overflow-hidden"
                    onClick={() => handlePhotoClick(memory)}
                  >
                    <img
                      src={memory.image}
                      alt={`Recuerdo ${memory.id}`}
                      className="w-full h-48 object-cover"
                    />
                  </motion.div>
                ))}
              </motion.div>

              {/* Footer Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="text-center"
              >
                <p className="text-xl text-romantic-pink font-medium text-shadow">
                  Gracias por estar en mi vida y crecer juntos.<br/>
                  Te quiero con todo mi corazón 💖🐼
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Letter Modal */}
      <AnimatePresence>
        {showLetter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={handleCloseLetter}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-gradient-to-br from-white to-pink-50 rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-romantic border-4 border-pink-200"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleCloseLetter}
                className="absolute top-4 left-4 bg-pink-500 hover:bg-pink-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl transition-all hover:rotate-90"
              >
                ←
              </button>

              <div className="text-center pt-8">
                <h2 className="text-3xl font-bold text-romantic-pink mb-6">
                  De mí para ti 💖
                </h2>
                
                <div className="text-gray-700 text-lg leading-relaxed space-y-4">
                  <p>
                    No sé por dónde empezar, pero quiero que sepas que te quiero muchísimo.
                    A veces puedo ser algo problemático, celoso o tener mis reacciones raras, pero estoy comprometido con esto, contigo.
                    Estoy aprendiendo, intentando hacerlo mejor cada día, porque realmente quiero ser una buena pareja para ti.
                  </p>
                  
                  <p>
                    Me hace muy feliz verte crecer, ver cómo te va bien en tu carrera, y sentir ese orgullo enorme al saber que estás logrando tus cosas.
                    De verdad espero que tu futuro sea increíble, y ojalá pueda estar ahí contigo para verlo, apoyarte y cuidarte siempre.
                  </p>
                  
                  <p>
                    También quiero que sepas que tú me inspiras.
                    Me incitas a ser mejor persona, a superarme en todo, porque verte a ti me motiva a no quedarme atrás y a esforzarme más.
                    Eres una grandiosa mujer, y tenerte a mi lado me hace sentir afortunado.
                  </p>
                  
                  <p>
                    Estoy muy feliz de ser tu pareja, de poder compartir contigo, reír, hablar de todo y disfrutar esos momentos que solo tú haces tan especiales.
                  </p>
                  
                  <p>
                    Gracias por estar conmigo, por tu cariño y por dejarme estar cerca de ti.
                  </p>
                  
                  <p className="font-semibold text-romantic-pink">
                    Te quiero mucho, y me hace feliz verte feliz. 💖
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Photo Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={handleClosePhoto}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-3xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-romantic"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleClosePhoto}
                className="absolute top-4 left-4 bg-pink-500 hover:bg-pink-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl transition-all hover:rotate-90"
              >
                ✕
              </button>

              <div className="text-center pt-8">
                <img
                  src={selectedPhoto.image}
                  alt={`Recuerdo ${selectedPhoto.id}`}
                  className="w-full max-h-[60vh] object-contain rounded-2xl shadow-lg mb-6"
                />
                
                <p className="text-xl text-romantic-pink font-medium text-center">
                  {selectedPhoto.caption}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};