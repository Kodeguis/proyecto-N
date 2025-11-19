import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
// import App from './App'
import DebugMainApp from './DebugMainApp'
import './index.css'
import { LoadingScreen } from './components/ui/LoadingScreen'
import { ErrorBoundary } from './components/ui/ErrorBoundary'

// Debugging para producción
console.log('=== MAIN: Iniciando aplicación ===');
console.log('Environment:', import.meta.env.MODE);
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL ? 'Configurado' : 'No configurado');

try {
  const rootElement = document.getElementById('root');
  console.log('Root element:', rootElement ? 'Encontrado' : 'No encontrado');
  
  if (!rootElement) {
    throw new Error('No se encontró el elemento root');
  }

  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          {/* <App /> */}
          <DebugMainApp />
        </Suspense>
      </ErrorBoundary>
    </StrictMode>,
  );
  
  console.log('=== MAIN: Aplicación renderizada exitosamente ===');
} catch (error) {
  console.error('=== MAIN: Error crítico al iniciar la aplicación ===', error);
  document.body.innerHTML = `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <h1>Error de aplicación</h1>
      <p>${error instanceof Error ? error.message : 'Error desconocido'}</p>
      <pre>${error instanceof Error ? error.stack : 'Sin stack trace'}</pre>
    </div>
  `;
}
