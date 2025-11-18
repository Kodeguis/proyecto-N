import { useStore } from '../../stores/appStoreDB';
import { useState } from 'react';

export const DebugPanel = () => {
  const currentPage = useStore((state) => state.currentPage);
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const isAdmin = useStore((state) => state.isAdmin);
  const currentUser = useStore((state) => state.currentUser);
  const setCurrentPage = useStore((state) => state.setCurrentPage);
  const addPoints = useStore((state) => state.addPoints);
  const [isExpanded, setIsExpanded] = useState(false);

  const testNavigation = () => {
    console.log('=== DEBUG PANEL: Test Navigation ===');
    console.log('Current Page:', currentPage);
    console.log('Is Authenticated:', isAuthenticated);
    console.log('Is Admin:', isAdmin);
    console.log('Current User:', currentUser);
    console.log('setCurrentPage function:', typeof setCurrentPage);
    console.log('addPoints function:', typeof addPoints);
    
    console.log('Testing navigation to cumpleanos...');
    setCurrentPage('cumpleanos');
  };

  const testNavigationToMenu = () => {
    console.log('=== DEBUG PANEL: Test Navigation to MENU ===');
    console.log('Attempting to navigate to menu...');
    setCurrentPage('menu');
  };

  const testAddPoints = () => {
    console.log('=== DEBUG PANEL: Test Add Points ===');
    if (currentUser) {
      console.log('Adding 10 points to user:', currentUser.id);
      addPoints(10);
    } else {
      console.log('No current user found, cannot add points');
    }
  };

  const testStoreFunctions = () => {
    console.log('=== DEBUG PANEL: Testing Store Functions ===');
    const store = useStore.getState();
    console.log('Available functions:', Object.keys(store));
    console.log('setCurrentPage type:', typeof store.setCurrentPage);
    console.log('addPoints type:', typeof store.addPoints);
  };

  return (
    <div className="fixed top-4 right-4 bg-black/80 text-white p-2 rounded text-xs font-mono z-50 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-2">
        <div className="text-[10px]">
          <span className="text-green-400">●</span> {currentPage}
        </div>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-gray-600 hover:bg-gray-700 px-1 py-0.5 rounded text-[10px]"
        >
          {isExpanded ? '−' : '+'}
        </button>
      </div>
      
      {isExpanded && (
        <div className="space-y-1 mt-2">
          <button 
            onClick={testNavigation}
            className="block w-full bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-[10px] text-left"
          >
            Test → Cumpleaños
          </button>
          <button 
            onClick={testNavigationToMenu}
            className="block w-full bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-[10px] text-left"
          >
            Test → Menú
          </button>
          <button 
            onClick={testAddPoints}
            className="block w-full bg-yellow-600 hover:bg-yellow-700 px-2 py-1 rounded text-[10px] text-left"
          >
            Test +10 Puntos
          </button>
          <button 
            onClick={testStoreFunctions}
            className="block w-full bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded text-[10px] text-left"
          >
            Test Store
          </button>
        </div>
      )}
    </div>
  );
};