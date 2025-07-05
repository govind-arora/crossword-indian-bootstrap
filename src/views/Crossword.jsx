import React from "react";
import { Container } from "reactstrap";
import { usePuzzle } from "../context/PuzzleContext";
import Header from "../components/Header";
import Puzzle from "../components/Puzzle";
import SizeSelector from "../components/SizeSelector";
import Footer from "../components/Footer";

export default function Crossword({ onNavigate }) {
  const { size, puzzle } = usePuzzle();

  return (
    <React.Fragment>
      <Header />
      
      <Container className="py-4">
        {size ? (
          <div>
            {puzzle && (
              <Puzzle />
            )}
          </div>
        ) : (
          <SizeSelector />
        )}
      </Container>
      
      {/* Footer with keyboard shortcuts and stats link */}
      <Footer onNavigate={onNavigate} />
    </React.Fragment>
  );
}
