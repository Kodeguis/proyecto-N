import { useState } from 'react';

export const LocalModeInfo = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg shadow-lg z-50">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold text-sm">🚀 Modo Local Activado</h3>
          <p className="text-xs mt-1">
            Funcionando sin base de datos. Usa usuario: <strong>nico</strong> y contraseña: <strong>nico123</strong>
          </p>
        </div>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-yellow-600 hover:text-yellow-800 font-bold text-lg"
        >
          ×
        </button>
      </div>
    </div>
  );
};