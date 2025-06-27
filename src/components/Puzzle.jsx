import React, { useState } from "react";
import CrosswordGrid from "./CrosswordGrid";
import CluesList from "./CluesList";

export default function Crossword({ puzzle, size }) {
  const [selectedClues, setSelectedClues] = useState([]); 
  // const [selectedClue, setSelectedClue] = useState(null);
  // const [direction, setDirection] = useState(''); // Across or Down
  const [selectedCell, setSelectedCell] = useState({ row: null, col: null });

  return (
    <div className="container d-flex flex-column justify-content-center px-5">
      <div className="h4 my-3 text-primary text-center">
        Theme: {puzzle.theme}
      </div>

      <div className="my-3 d-flex justify-content-center">
        <CrosswordGrid
          size={size}
          puzzle={puzzle}
          selectedCell={selectedCell}
          setSelectedCell={setSelectedCell}
          selectedClues={selectedClues}
          setSelectedClues={setSelectedClues}
        />
      </div>

      {selectedCell.row !== null && (
        <div className="my-3 d-flex justify-content-center">
          <div className="bg-light rounded shadow-sm w-50">
            <CluesList clues={puzzle.clues} selectedClues={selectedClues} />
          </div>
        </div>
      )}
    </div>
  );
}
