import React, { useState } from "react";
import CrosswordGrid from "./CrosswordGrid";
import CluesList from "./CluesList";

export default function Crossword({ puzzle, size }) {
  const [selectedClues, setSelectedClues] = useState([]);

  const handleCellSelect = (clues) => {
    setSelectedClues(clues);
  };

  return (
    <div>
      <h4 className="mb-3 text-primary">Theme: {puzzle.theme}</h4>
      <div className="row">
        <div className="col-md-9">
          <CrosswordGrid
            size={size}
            puzzle={puzzle}
            onCellSelect={handleCellSelect}
          />
        </div>
        <div className="col-md-3">
          <CluesList clues={puzzle.clues} selectedClues={selectedClues} />
        </div>
      </div>
    </div>
  );
}
