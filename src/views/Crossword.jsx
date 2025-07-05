import React, { useState } from "react";
import { Container } from "reactstrap";

import { PuzzleProvider, usePuzzle } from "../context/PuzzleContext";

import Header from "../components/Header";
import Puzzle from "../components/Puzzle";
import Footer from "../components/Footer";
import SizeSelector from "../components/SizeSelector";
import StatsViewModal from "../components/StatsViewModal";
import KeyboardShortcutsModal from "../components/KeyboardShortcutsModal";

function CrosswordContent() {
  const { size, puzzle } = usePuzzle();

  const [showStats, setShowStats] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);

  // Handle navigation
  const handleModalOpen = (type) => {
    if (type === "keyboardShortcuts") {
      setShowKeyboardShortcuts(true);
    } else if (type === "stats") {
      setShowStats(true);
    }
  };

  return (
    <React.Fragment>
      <Header />

      <Container className="py-4">
        {size ? <div>{puzzle && <Puzzle />}</div> : <SizeSelector />}
      </Container>

      {/* Footer with keyboard shortcuts and stats link */}
      <Footer handleModalOpen={handleModalOpen} />

      {/* Modals for stats and keyboard shortcuts */}
      <StatsViewModal
        isOpen={showStats}
        toggle={() => setShowStats(!showStats)}
      />

      <KeyboardShortcutsModal
        isOpen={showKeyboardShortcuts}
        toggle={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
      />
    </React.Fragment>
  );
}

export default function Crossword() {
  return (
    <PuzzleProvider>
      <CrosswordContent />
    </PuzzleProvider>
  );
}
