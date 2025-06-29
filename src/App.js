import React, { useState } from 'react';
import { PuzzleProvider } from './context/PuzzleContext';
import Crossword from './views/Crossword';
import StatsView from './components/StatsView';
import KeyboardShortcutsModal from './components/KeyboardShortcutsModal';
import { Button } from 'reactstrap';

export default function App() {
  const [currentView, setCurrentView] = useState('game');
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  
  // Handle navigation
  const handleNavigation = (event) => {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');
    
    if (href === '#keyboard-shortcuts') {
      setShowKeyboardShortcuts(true);
    } else if (href === '#puzzle-stats') {
      setCurrentView('stats');
    } else if (href === '#game') {
      setCurrentView('game');
    }
  };
  
  return (
    <PuzzleProvider>
      <div className="app-container d-flex flex-column min-vh-100">
        {currentView === 'game' ? (
          <Crossword onNavigate={handleNavigation} />
        ) : currentView === 'stats' ? (
          <>
            <div className="container py-3">
              <Button 
                color="primary" 
                onClick={() => setCurrentView('game')}
                className="mb-4"
              >
                &larr; Back to Game
              </Button>
              <StatsView />
            </div>
          </>
        ) : null}
        
        <KeyboardShortcutsModal 
          isOpen={showKeyboardShortcuts} 
          toggle={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)} 
        />
      </div>
    </PuzzleProvider>
  );
}
