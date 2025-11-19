import { useState, useEffect } from 'react';
import { DebugApp } from './components/ui/DebugApp';

function DebugMainApp() {
  const [showDebug, setShowDebug] = useState(true);
  const [showRealApp, setShowRealApp] = useState(false);

  useEffect(() => {
    console.log('=== DEBUG MAIN: Montado ===');
    
    // Verificar variables de entorno
    console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL ? 'Configurado' : 'No configurado');
    console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Configurado' : 'No configurado');
    
    // Intentar cargar la aplicación real después de 3 segundos
    const timer = setTimeout(() => {
      console.log('Intentando cargar aplicación real...');
      setShowRealApp(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {showDebug && (
        <div className="p-4">
          <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-4 mb-4">
            <h2 className="text-lg font-bold text-yellow-800 mb-2">🐛 Modo Debug Activado</h2>
            <p className="text-yellow-700 mb-2">
              Esto ayudará a identificar el problema de la pantalla blanca.
            </p>
            <button 
              onClick={() => setShowDebug(false)}
              className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
            >
              Cerrar Debug
            </button>
          </div>
          <DebugApp />
        </div>
      )}
      
      {showRealApp && !showDebug && (
        <div className="p-4">
          <div className="bg-blue-100 border border-blue-400 rounded-lg p-4 mb-4">
            <h2 className="text-lg font-bold text-blue-800">🚀 Aplicación Real</h2>
            <p className="text-blue-700">La aplicación debería cargar aquí...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default DebugMainApp;