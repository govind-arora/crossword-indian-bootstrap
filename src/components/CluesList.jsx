import React from "react";
import { usePuzzle } from "../context/PuzzleContext";

export default function CluesList() {
  const { selectedClues, highlightedClue, setHighlightedClue } =
    usePuzzle();

  // Get selected clues by direction
  const acrossClues = selectedClues.filter((c) => c.direction === "across");
  const downClues = selectedClues.filter((c) => c.direction === "down");

  // Handle clue selection
  const handleClueClick = (clue) => {
    setHighlightedClue(clue);
  };

  // Check if a clue is highlighted
  const isHighlighted = (clue) => {
    return (
      highlightedClue &&
      highlightedClue.direction === clue.direction &&
      highlightedClue.number === clue.number
    );
  };

  return (
    <div className="clues-container">
      <div>
        {acrossClues.length > 0 && (
          <div className="mb-3">
            <h6 className="fw-bold border-bottom pb-1 mb-2">Across</h6>
            {acrossClues.map((clue) => (
              <div
                key={`sel-across-${clue.number}`}
                className={`mb-2 p-2 rounded ${
                  isHighlighted(clue) ? "bg-info-subtle" : ""
                }`}
                onClick={() => handleClueClick(clue)}
                style={{ cursor: "pointer" }}
              >
                <strong>{clue.number}.</strong> {clue.clue} (
                {clue.answer.length})
              </div>
            ))}
          </div>
        )}

        {downClues.length > 0 && (
          <div>
            <h6 className="fw-bold border-bottom pb-1 mb-2">Down</h6>
            {downClues.map((clue) => (
              <div
                key={`sel-down-${clue.number}`}
                className={`mb-2 p-2 rounded ${
                  isHighlighted(clue) ? "bg-info-subtle" : ""
                }`}
                onClick={() => handleClueClick(clue)}
                style={{ cursor: "pointer" }}
              >
                <strong>{clue.number}.</strong> {clue.clue} (
                {clue.answer.length})
              </div>
            ))}
          </div>
        )}

        {acrossClues.length === 0 && downClues.length === 0 && (
          <div className="text-center text-muted py-4">
            <p>Select a cell to see relevant clues</p>
          </div>
        )}
      </div>
    </div>
  );
}
