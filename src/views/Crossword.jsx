import React from "react";
import { usePuzzle } from "../context/PuzzleContext";
import Header from "../components/Header";
import Puzzle from "../components/Puzzle";
import SizeSelector from "../components/SizeSelector";
import { Container } from "reactstrap";

export default function Crossword({ onNavigate }) {
  const { size, puzzle } = usePuzzle();

  return (
    <React.Fragment>
      <Header />
      
      <Container className="py-4">
        {size ? (
          <div>
            {puzzle && puzzle.size === size && (
              <Puzzle />
            )}
          </div>
        ) : (
          <SizeSelector />
        )}
      </Container>
      
      {/* Footer with keyboard shortcuts and stats link */}
      <footer className="bg-light py-3 mt-auto">
        <Container>
          <div className="d-flex justify-content-between align-items-center small">
            <div>
              <span className="text-muted">© {new Date().getFullYear()} Daily Crossword</span>
            </div>
            <div>
              <a href="#keyboard-shortcuts" className="text-decoration-none me-3" onClick={onNavigate}>Keyboard Shortcuts</a>
              <a href="#puzzle-stats" className="text-decoration-none" onClick={onNavigate}>Stats</a>
            </div>
          </div>
        </Container>
      </footer>
    </React.Fragment>
  );
}
