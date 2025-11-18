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
    <div className="fixed top-4 right-4 bg-black/60 text-white p-2 rounded text-xs font-mono z-50 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <div className="text-[10px]">
          <span className="text-green-400">●</span> {currentPage}
        </div>
        <button 
          onClick={testNavigation}
          className="bg-blue-600 hover:bg-blue-700 px-1 py-0.5 rounded text-[10px]"
        >
          Test
        </button>
      </div>
    </div>
  );
};