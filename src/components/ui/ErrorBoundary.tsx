import { Component, ReactNode } from 'react';
import { Heart, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    // Clear any stored data that might be causing issues
    sessionStorage.clear();
    localStorage.clear();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-romantic-gradient bg-[length:400%_400%] animate-gradient-shift flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-romantic text-center max-w-md">
            <div className="mb-6">
              <Heart className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                ¡Ups! Algo salió mal
              </h1>
              <p className="text-gray-600 mb-6">
                Pero no te preocupes, nuestro amor sigue intacto 💖
              </p>
              {this.state.error && (
                <details className="mb-6 text-left">
                  <summary className="cursor-pointer text-sm text-gray-500 mb-2">
                    Detalles del error
                  </summary>
                  <pre className="text-xs bg-gray-100 p-3 rounded-lg overflow-auto max-h-32">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
              <button
                onClick={this.handleReset}
                className="bg-love-gradient text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-love transition-all duration-300 transform hover:-translate-y-1 inline-flex items-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Intentar de nuevo
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}