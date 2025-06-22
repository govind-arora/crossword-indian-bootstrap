import { useState, useEffect } from "react";
import { Card, CardBody, CardTitle, Input } from "reactstrap";

export default function CrosswordGrid({ size, puzzle, onCellSelect }) {
  const [grid, setGrid] = useState(generateEmptyGrid(size));
  const [selectedCell, setSelectedCell] = useState({ row: null, col: null });
  const [selectedClues, setSelectedClues] = useState([]);

  useEffect(() => {
    setGrid(generateEmptyGrid(size));
    setSelectedCell({ row: null, col: null });
  }, [size]);

  function handleChange(row, col, value) {
    const newGrid = [...grid];
    newGrid[row][col] = value.slice(-1).toUpperCase();
    setGrid(newGrid);

    // If a character was entered, move to the next cell
    if (value) {
      moveToNextCell(row, col);
    }
  }

  function moveToNextCell(row, col) {
    // Try to determine direction based on selected clues
    const hasAcrossClue = selectedClues.some(
      (clue) => clue.direction === "across"
    );
    const hasDownClue = selectedClues.some((clue) => clue.direction === "down");

    let nextRow = row;
    let nextCol = col;

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

    // Select the next cell if it's valid
    if (nextRow !== row || nextCol !== col) {
      handleCellSelect(nextRow, nextCol);
    }
  }

  function handleCellSelect(row, col) {
    setSelectedCell({ row, col });
    const clues = findClueForCell(row, col);
    setSelectedClues(clues);
    if (onCellSelect) {
      onCellSelect(clues);
    }
  }

  function findClueForCell(row, col) {
    const selectedClues = [];

    // Skip empty cells
    if (puzzle.grid[row][col] === "") {
      return selectedClues;
    }

    // Check if the cell is part of an across clue
    puzzle.clues.across.forEach((clue) => {
      const clueRow = clue.row;
      const clueCol = clue.col;
      const clueLength = clue.answer.length;

      if (row === clueRow && col >= clueCol && col < clueCol + clueLength) {
        selectedClues.push({
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
        selectedClues.push({
          ...clue,
          direction: "down",
        });
      }
    });

    return selectedClues;
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
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const puzzleGrid = puzzle.grid;
              const isBlackCell = puzzleGrid[rowIndex][colIndex] === "";

              const isSelected =
                selectedCell.row === rowIndex && selectedCell.col === colIndex;
              const isInSelectedPath = isPartOfSelectedClue(rowIndex, colIndex);
              let cellClassName = isBlackCell
                ? "bg-dark text-white"
                : isSelected
                ? "bg-primary text-white"
                : isInSelectedPath
                ? "bg-info-subtle"
                : "bg-light";

              return (
                <Input
                  key={`${rowIndex}-${colIndex}`}
                  type="text"
                  maxLength={1}
                  value={cell}
                  onChange={(e) =>
                    handleChange(rowIndex, colIndex, e.target.value)
                  }
                  onClick={() =>
                    !isBlackCell && handleCellSelect(rowIndex, colIndex)
                  }
                  onFocus={() =>
                    !isBlackCell && handleCellSelect(rowIndex, colIndex)
                  }
                  style={cellStyle}
                  className={cellClassName}
                  disabled={isBlackCell}
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
