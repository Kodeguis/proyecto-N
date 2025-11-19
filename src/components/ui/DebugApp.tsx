import { useEffect, useState } from 'react';

export const DebugApp = () => {
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const info = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      env: {
        MODE: import.meta.env.MODE,
        PROD: import.meta.env.PROD,
        DEV: import.meta.env.DEV,
        SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ? 'Configurado' : 'No configurado',
        SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Configurado' : 'No configurado'
      },
      localStorage: {
        length: localStorage.length,
        keys: Object.keys(localStorage)
      },
      errors: []
    };

    // Capturar errores globales
    window.addEventListener('error', (event) => {
      info.errors.push({
        type: 'error',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
      setDebugInfo({...info});
    });

    window.addEventListener('unhandledrejection', (event) => {
      info.errors.push({
        type: 'unhandledrejection',
        reason: event.reason?.toString() || 'Unknown'
      });
      setDebugInfo({...info});
    });

    setDebugInfo(info);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-red-600 mb-4">🚨 Debug Mode</h1>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="font-semibold mb-2">Información General</h2>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {JSON.stringify({
                timestamp: debugInfo.timestamp,
                url: debugInfo.url,
                userAgent: debugInfo.userAgent?.substring(0, 100) + '...'
              }, null, 2)}
            </pre>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="font-semibold mb-2">Variables de Entorno</h2>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {JSON.stringify(debugInfo.env, null, 2)}
            </pre>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="font-semibold mb-2">Local Storage</h2>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {JSON.stringify(debugInfo.localStorage, null, 2)}
            </pre>
          </div>

          {debugInfo.errors?.length > 0 && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h2 className="font-semibold mb-2 text-red-700">Errores Detectados</h2>
              <pre className="text-sm text-red-700 whitespace-pre-wrap">
                {JSON.stringify(debugInfo.errors, null, 2)}
              </pre>
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h2 className="font-semibold mb-2 text-blue-700">Acciones</h2>
            <div className="space-y-2">
              <button 
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mr-2"
              >
                Limpiar LocalStorage
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Recargar Página
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};