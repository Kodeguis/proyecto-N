export const SimpleLoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">💖</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Cargando...</h1>
        <p className="text-gray-600">Preparando tu espacio especial</p>
      </div>
    </div>
  );
};