import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useStore } from '../../stores/appStore';
import { RomanticButton } from '../ui/RomanticButton';

interface HTMLEmbedProps {
  pageName: string;
}

export const HTMLEmbed: React.FC<HTMLEmbedProps> = ({ pageName }) => {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const setCurrentPage = useStore((state) => state.setCurrentPage);

  useEffect(() => {
    const loadHTML = async () => {
      try {
        setLoading(true);
        setError(false);
        
        // Mapear los nombres de página a los archivos HTML
        const htmlFiles: Record<string, string> = {
          'cumpleanos': './cumpleanos2025.html',
          'mensajes-diarios': './mensajes-diarios.html',
          'trivia': './trivia.html',
          'cupones': './cupones.html'
        };

        const filePath = htmlFiles[pageName];
        if (!filePath) {
          throw new Error(`Página ${pageName} no encontrada`);
        }

        const response = await fetch(filePath);
        if (!response.ok) {
          throw new Error(`Error al cargar ${filePath}`);
        }
        
        const html = await response.text();
        setHtmlContent(html);
      } catch (err) {
        console.error('Error loading HTML:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadHTML();
  }, [pageName]);

  const handleGoBack = () => {
    setCurrentPage('menu');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-romantic-gradient bg-[length:400%_400%] animate-gradient-shift flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center text-white"
        >
          <div className="text-6xl mb-4">💖</div>
          <p className="text-lg">Cargando contenido especial...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-romantic-gradient bg-[length:400%_400%] animate-gradient-shift flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 text-center max-w-md"
        >
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-bold text-romantic-pink mb-2">Ups! Algo salió mal</h2>
          <p className="text-gray-600 mb-6">
            No pudimos cargar el contenido. Por favor, intenta de nuevo.
          </p>
          <RomanticButton onClick={() => window.location.reload()}>
            Reintentar
          </RomanticButton>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-romantic-gradient bg-[length:400%_400%] animate-gradient-shift relative">
      {/* Header con botón de regreso */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm shadow-lg"
      >
        <div className="flex items-center justify-between p-4 max-w-6xl mx-auto">
          <RomanticButton
            onClick={handleGoBack}
            variant="secondary"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Menú
          </RomanticButton>
          <h1 className="text-xl font-bold text-romantic-pink capitalize">
            {pageName.replace('-', ' ')}
          </h1>
        </div>
      </motion.div>

      {/* Contenedor para el HTML externo */}
      <div 
        className="pt-20 h-screen overflow-auto"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
        style={{
          // Asegurar que el contenido HTML se muestre correctamente
          width: '100%',
          height: '100vh',
          overflow: 'auto'
        }}
      />
    </div>
  );
};