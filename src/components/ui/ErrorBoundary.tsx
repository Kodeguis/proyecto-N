import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('=== ERROR BOUNDARY: Error capturado ===');
    console.error('Error:', error);
    console.error('Stack:', error.stack);
    console.error('Error Info:', errorInfo);
    console.error('Component Stack:', errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center p-4">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-2xl w-full">
            <h1 className="text-2xl font-bold text-red-600 mb-4">🚨 ¡Ups! Algo salió mal</h1>
            <p className="text-gray-600 mb-4">{this.state.error?.message || 'Error desconocido'}</p>
            
            {this.state.error?.stack && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Detalles del error:</h3>
                <pre className="text-left text-xs bg-gray-100 p-4 rounded-lg overflow-auto max-h-40 text-red-600">
                  {this.state.error.stack}
                </pre>
              </div>
            )}
            
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>💡 Consejo:</strong> Si el error persiste, verifica que las variables de entorno estén configuradas correctamente en Vercel.
              </p>
            </div>
            
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
              🔄 Recargar página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}