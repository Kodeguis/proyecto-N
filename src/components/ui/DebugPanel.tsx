import { useStore } from '../../stores/appStoreDB';

export const DebugPanel = () => {
  const currentPage = useStore((state) => state.currentPage);
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const isAdmin = useStore((state) => state.isAdmin);
  const currentUser = useStore((state) => state.currentUser);
  const setCurrentPage = useStore((state) => state.setCurrentPage);

  const testNavigation = () => {
    console.log('=== DEBUG INFO ===');
    console.log('Current Page:', currentPage);
    console.log('Is Authenticated:', isAuthenticated);
    console.log('Is Admin:', isAdmin);
    console.log('Current User:', currentUser);
    console.log('==================');
    
    // Test navigation
    console.log('Testing navigation to cumpleanos...');
    setCurrentPage('cumpleanos');
  };

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono z-50">
      <div className="mb-2">
        <strong>Debug Panel</strong>
      </div>
      <div>Page: {currentPage}</div>
      <div>Auth: {isAuthenticated ? '✅' : '❌'}</div>
      <div>Admin: {isAdmin ? '✅' : '❌'}</div>
      <div>User: {currentUser?.username || 'None'}</div>
      <button 
        onClick={testNavigation}
        className="mt-2 bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded text-xs"
      >
        Test Nav
      </button>
    </div>
  );
};