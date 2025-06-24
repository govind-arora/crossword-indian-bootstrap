import { useState, useEffect } from "react";
import { Card, CardBody, CardTitle, Input } from "reactstrap";

export default function CrosswordGrid({
  size,
  puzzle,
  selectedCell,
  setSelectedCell,
  selectedClues,
  setSelectedClues,
}) {
  const [grid, setGrid] = useState(generateEmptyGrid(size));
  const [highlightedClue, setHighlightedClue] = useState(null);

  useEffect(() => {
    setGrid(generateEmptyGrid(size));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size]);

  function handleChange(row, col, value) {
    const newGrid = [...grid];
    newGrid[row][col] = value.slice(-1).toUpperCase();
    setGrid(newGrid);

    // Check if we need to update the highlighted clue
    if (highlightedClue && selectedClues.length > 1) {
      // If we have multiple clues for this cell and user is entering letters,
      // we want to maintain direction of movement consistent with the current highlighted clue
      const currentDirection = highlightedClue.direction;
      
      // Find the other clue if any
      const otherClue = selectedClues.find(clue => clue.direction !== currentDirection);
      
      // If we filled all cells in the current direction's clue, switch to the other clue if available
      if (otherClue) {
        const filledCells = currentDirection === "across" 
          ? grid[row].slice(highlightedClue.col, highlightedClue.col + highlightedClue.answer.length).filter(cell => cell !== "").length
          : grid.map(r => r[col]).slice(highlightedClue.row, highlightedClue.row + highlightedClue.answer.length).filter(cell => cell !== "").length;
        
        if (filledCells >= highlightedClue.answer.length - 1) {
          setHighlightedClue(otherClue);
        }
      }
    }

    // If a character was entered, move to the next cell
    if (value) {
      moveToNextCell(row, col);
    }
  }

  function moveToNextCell(row, col) {
    let nextRow = row;
    let nextCol = col;

    // Check if we have a highlighted clue to determine direction
    if (highlightedClue) {
      if (highlightedClue.direction === "across") {
        // Move right
        nextCol = col + 1;
        // Check if we're still in the same clue
        if (
          nextCol >= size || 
          puzzle.grid[nextRow][nextCol] === "" || 
          nextCol >= highlightedClue.col + highlightedClue.answer.length
        ) {
          return; // Stop at the end, black cell, or end of current clue
        }
      } else if (highlightedClue.direction === "down") {
        // Move down
        nextRow = row + 1;
        // Check if we're still in the same clue
        if (
          nextRow >= size || 
          puzzle.grid[nextRow][nextCol] === "" ||
          nextRow >= highlightedClue.row + highlightedClue.answer.length
        ) {
          return; // Stop at the end, black cell, or end of current clue
        }
      }
    } else {
      // Fallback to previous behavior if no highlighted clue
      const hasAcrossClue = selectedClues.some(
        (clue) => clue.direction === "across"
      );
      const hasDownClue = selectedClues.some((clue) => clue.direction === "down");

      if (
        hasAcrossClue &&
        (!hasDownClue || selectedClues[0]?.direction === "across")
      ) {
        // Move right
        nextCol = col + 1;
        if (nextCol >= size || puzzle.grid[nextRow][nextCol] === "") {
          return; // Stop at the end or black cell
        }
      } else if (hasDownClue) {
        // Move down
        nextRow = row + 1;
        if (nextRow >= size || puzzle.grid[nextRow][nextCol] === "") {
          return; // Stop at the end or black cell
        }
      }
    }

    // Select the next cell if it's valid
    if (nextRow !== row || nextCol !== col) {
      handleCellSelect(nextRow, nextCol);
      // Set focus to the next input element
      setTimeout(() => {
      const nextInput = document.querySelector(
        `input[data-key="${nextRow}-${nextCol}"]`
      );
      if (nextInput) nextInput.focus();
      }, 0);
    }
  }

  function handleCellSelect(row, col) {
    setSelectedCell({ row, col });

    const clues = [];

    puzzle.clues.across.forEach((clue) => {
      const clueRow = clue.row;
      const clueCol = clue.col;
      const clueLength = clue.answer.length;

      if (row === clueRow && col >= clueCol && col < clueCol + clueLength) {
        clues.push({
          ...clue,
          direction: "across",
        });
      }
    });

    // Check if the cell is part of a down clue
    puzzle.clues.down.forEach((clue) => {
      const clueRow = clue.row;
      const clueCol = clue.col;
      const clueLength = clue.answer.length;

      if (col === clueCol && row >= clueRow && row < clueRow + clueLength) {
        clues.push({
          ...clue,
          direction: "down",
        });
      }
    });

    setSelectedClues(clues);
    setHighlightedClue(clues.length ? clues[0] : null);
  }

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${parseInt(size)}, 3rem)`,
    gap: "0.25rem",
  };

  const cellStyle = {
    width: "3rem",
    height: "2.5rem",
    textAlign: "center",
    textTransform: "uppercase",
    fontSize: "1.25rem",
    fontWeight: "600",
    caretColor: "transparent",
  };

  const isPartOfSelectedClue = (row, col) => {
    if (!selectedClues.length) return false;

    return selectedClues.some((clue) => {
      if (clue.direction === "across") {
        return (
          row === clue.row &&
          col >= clue.col &&
          col < clue.col + clue.answer.length
        );
      } else if (clue.direction === "down") {
        return (
          col === clue.col &&
          row >= clue.row &&
          row < clue.row + clue.answer.length
        );
      }
      return false;
    });
  };

  return (
    <Card className="shadow">
      <CardBody>
        <CardTitle tag="p" className="mb-4">
          Crossword Grid ({size})
        </CardTitle>
        <div style={gridStyle}>
          {grid.map((row, rIndex) =>
            row.map((cell, cIndex) => {
              const puzzleGrid = puzzle.grid;
              const isBlackCell = puzzleGrid[rIndex][cIndex] === "";

              if (isBlackCell) {
                return (
                  <div
                    key={`${rIndex}-${cIndex}`}
                    style={cellStyle}
                    className="bg-dark text-white"
                  />
                );
              }

              const isSelected =
                selectedCell.row === rIndex && selectedCell.col === cIndex;
              const isInSelectedPath = isPartOfSelectedClue(rIndex, cIndex);
              let cellClassName = isSelected
                ? "bg-primary text-white"
                : isInSelectedPath
                ? "bg-info-subtle"
                : "bg-light";

                return (
                  <Input
                    key={`${rIndex}-${cIndex}`}
                    data-key={`${rIndex}-${cIndex}`}
                    type="text"
                    maxLength={1}
                    value={cell}
                    onChange={(e) =>
                      handleChange(rIndex, cIndex, e.target.value)
                    }
                    onClick={() => handleCellSelect(rIndex, cIndex)}
                    onFocus={() => handleCellSelect(rIndex, cIndex)}
                    style={cellStyle}
                    className={`${cellClassName} no-cursor`}
                    disabled={isBlackCell}
                    autoComplete="off"
                  />
                );
            })
          )}
        </div>
      </CardBody>
    </Card>
  );
}

// Utility to generate an empty grid of given size
function generateEmptyGrid(size) {
  const n = parseInt(size);
  return Array.from({ length: n }, () => Array(n).fill(""));
}
