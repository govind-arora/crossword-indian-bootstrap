import React, { useState } from "react";
import { PuzzleProvider } from "./context/PuzzleContext";
import Crossword from "./views/Crossword";
import StatsView from "./components/StatsView";
import KeyboardShortcutsModal from "./components/KeyboardShortcutsModal";

export default function App() {
  const [currentView, setCurrentView] = useState("game");
  const [showStats, setShowStats] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);

  // Handle navigation
  const handleNavigation = (event) => {
    event.preventDefault();
    const href = event.currentTarget.getAttribute("href");

    if (href === "#keyboard-shortcuts") {
      setShowKeyboardShortcuts(true);
    } else if (href === "#puzzle-stats") {
      setShowStats(true);
    } else if (href === "#game") {
      setCurrentView("game");
    }
  };

  return (
    <PuzzleProvider>
      <div className="app-container d-flex flex-column min-vh-100">
        {currentView === "game" ? (
          <Crossword onNavigate={handleNavigation} />
        ) : null}

        <StatsView isOpen={showStats} toggle={() => setShowStats(!showStats)} />

        <KeyboardShortcutsModal
          isOpen={showKeyboardShortcuts}
          toggle={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
        />
      </div>
    </PuzzleProvider>
  );
}
