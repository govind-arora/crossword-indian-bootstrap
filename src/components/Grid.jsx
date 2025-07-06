import React from "react";
import { Card, CardBody, CardTitle, Input } from "reactstrap";
import { usePuzzle } from "../context/PuzzleContext";

export default function Grid() {
  const {
    size: sizeString,
    puzzle,
    selectedCell,
    setSelectedCell,
    selectedClues,
    setSelectedClues,
    grid,
    setGrid,
    highlightedClue,
    setHighlightedClue
  } = usePuzzle();
  
  const size = parseInt(sizeString?.split('x')[0]) || 0;

  // Grid is now managed by context

  // Move to the previous cell when backspacing
  function moveToPreviousCell(row, col) {
    let prevRow = row;
    let prevCol = col;

    if (highlightedClue) {
      if (highlightedClue.direction === "across") {
        // Move left
        prevCol = col - 1;
        
        // Check if we're still in the same clue
        if (
          prevCol < 0 ||
          puzzle.grid[prevRow][prevCol] === "" ||
          prevCol < highlightedClue.col
        ) {
          return; // Stop at the beginning, black cell, or start of current clue
        }
      } else if (highlightedClue.direction === "down") {
        // Move up
        prevRow = row - 1;
        
        // Check if we're still in the same clue
        if (
          prevRow < 0 ||
          puzzle.grid[prevRow][prevCol] === "" ||
          prevRow < highlightedClue.row
        ) {
          return; // Stop at the beginning, black cell, or start of current clue
        }
      }
    } else {
      // Fallback behavior if no highlighted clue
      const hasAcrossClue = selectedClues.some(
        (clue) => clue.direction === "across"
      );
      const hasDownClue = selectedClues.some(
        (clue) => clue.direction === "down"
      );

      if (
        hasAcrossClue &&
        (!hasDownClue || selectedClues[0]?.direction === "across")
      ) {
        // Move left
        prevCol = col - 1;
        if (prevCol < 0 || puzzle.grid[prevRow][prevCol] === "") {
          return; // Stop at the beginning or black cell
        }
      } else if (hasDownClue) {
        // Move up
        prevRow = row - 1;
        if (prevRow < 0 || puzzle.grid[prevRow][prevCol] === "") {
          return; // Stop at the beginning or black cell
        }
      }
    }

    // Select the previous cell if it's valid
    if (prevRow !== row || prevCol !== col) {
      handleCellSelect(prevRow, prevCol);
      // Set focus to the previous input element
      setTimeout(() => {
        const prevInput = document.querySelector(
          `input[data-key="${prevRow}-${prevCol}"]`
        );
        if (prevInput) prevInput.focus();
      }, 0);
    }
  }

  function handleChange(row, col, value) {
    const oldValue = grid[row][col];
    // Check if the user is deleting (backspace or delete key)
    const isDeleting = value === '' && oldValue !== '';
    
    // If it's a regular input, take only the last character and make it uppercase
    // If deleting, use an empty string
    const newValue = isDeleting ? '' : value.slice(-1).toUpperCase();
    
    const newGrid = [...grid];
    newGrid[row][col] = newValue;
    setGrid(newGrid);

    // Check if we need to update the highlighted clue
    if (highlightedClue && selectedClues.length > 1) {
      // If we have multiple clues for this cell and user is entering letters,
      // we want to maintain direction of movement consistent with the current highlighted clue
      const currentDirection = highlightedClue.direction;

      // Find the other clue if any
      const otherClue = selectedClues.find(
        (clue) => clue.direction !== currentDirection
      );

      // If we filled all cells in the current direction's clue, switch to the other clue if available
      if (otherClue) {
        const filledCells =
          currentDirection === "across"
            ? grid[row]
                .slice(
                  highlightedClue.col,
                  highlightedClue.col + highlightedClue.answer.length
                )
                .filter((cell) => cell !== "").length
            : grid
                .map((r) => r[col])
                .slice(
                  highlightedClue.row,
                  highlightedClue.row + highlightedClue.answer.length
                )
                .filter((cell) => cell !== "").length;

        if (filledCells >= highlightedClue.answer.length - 1) {
          setHighlightedClue(otherClue);
        }
      }
    }

    if (isDeleting) {
      // For deletion, move to the previous cell
      moveToPreviousCell(row, col);
    } else if (value) {
      // If a character was entered, move to the next cell
      moveToNextCell(row, col);
    }
  }

  function moveToNextCell(row, col) {
    let nextRow = row;
    let nextCol = col;
    let movedToNextClue = false;

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
          // We've reached the end of this clue
          
          // Check if there's a down clue at this cell we can switch to
          const downClue = selectedClues.find(clue => clue.direction === "down");
          if (downClue) {
            // Switch to the down clue at the same cell
            setHighlightedClue(downClue);
            movedToNextClue = true;
          } else {
            // Try to find the next clue in the puzzle to move to
            const nextClue = findNextClue(highlightedClue);
            if (nextClue) {
              // Move to the start of the next clue
              nextRow = nextClue.row;
              nextCol = nextClue.col;
              movedToNextClue = true;
            } else {
              return; // No more clues to move to
            }
          }
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
          // We've reached the end of this clue
          
          // Check if there's an across clue at this cell we can switch to
          const acrossClue = selectedClues.find(clue => clue.direction === "across");
          if (acrossClue) {
            // Switch to the across clue at the same cell
            setHighlightedClue(acrossClue);
            movedToNextClue = true;
          } else {
            // Try to find the next clue in the puzzle to move to
            const nextClue = findNextClue(highlightedClue);
            if (nextClue) {
              // Move to the start of the next clue
              nextRow = nextClue.row;
              nextCol = nextClue.col;
              movedToNextClue = true;
            } else {
              return; // No more clues to move to
            }
          }
        }
      }
    } else {
      // Fallback to previous behavior if no highlighted clue
      const hasAcrossClue = selectedClues.some(
        (clue) => clue.direction === "across"
      );
      const hasDownClue = selectedClues.some(
        (clue) => clue.direction === "down"
      );

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
      
      // If we moved to a new clue, make sure it gets highlighted
      if (movedToNextClue && highlightedClue) {
        // The handleCellSelect will set the clues, but we need to ensure the right one is highlighted
        setTimeout(() => {
          const direction = highlightedClue.direction;
          const newClue = selectedClues.find(clue => clue.direction === direction);
          if (newClue) {
            setHighlightedClue(newClue);
          }
        }, 0);
      }
      
      // Set focus to the next input element
      setTimeout(() => {
        const nextInput = document.querySelector(
          `input[data-key="${nextRow}-${nextCol}"]`
        );
        if (nextInput) nextInput.focus();
      }, 0);
    }
  }
  
  // Helper function to find the next clue in the puzzle
  function findNextClue(currentClue) {
    // First try to find the next clue in the same direction
    const clueList = currentClue.direction === "across" ? [...puzzle.clues.across] : [...puzzle.clues.down];
    
    // Sort clues by number
    clueList.sort((a, b) => a.number - b.number);
    
    // Find the index of the current clue
    const currentIndex = clueList.findIndex(clue => 
      clue.row === currentClue.row && 
      clue.col === currentClue.col && 
      clue.number === currentClue.number
    );
    
    // If there's a next clue in the same direction, return it
    if (currentIndex !== -1 && currentIndex < clueList.length - 1) {
      return {
        ...clueList[currentIndex + 1],
        direction: currentClue.direction
      };
    }
    
    // If we're at the end of across clues, try to start down clues
    if (currentClue.direction === "across" && puzzle.clues.down.length > 0) {
      // Sort down clues by number
      const downClues = [...puzzle.clues.down].sort((a, b) => a.number - b.number);
      return {
        ...downClues[0],
        direction: "down"
      };
    }
    
    // If we're at the end of down clues, loop back to the first across clue
    if (currentClue.direction === "down" && puzzle.clues.across.length > 0) {
      // Sort across clues by number
      const acrossClues = [...puzzle.clues.across].sort((a, b) => a.number - b.number);
      return {
        ...acrossClues[0],
        direction: "across"
      };
    }
    
    // If no next clue found
    return null;
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

  // Handle keyboard navigation
  function handleKeyDown(row, col, e) {
    // Prevent default for arrow keys to avoid unwanted scrolling
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
      e.preventDefault();
      
      switch (e.key) {
        case 'ArrowUp':
          navigateToCell(row - 1, col);
          break;
        case 'ArrowDown':
          navigateToCell(row + 1, col);
          break;
        case 'ArrowLeft':
          navigateToCell(row, col - 1);
          break;
        case 'ArrowRight':
          navigateToCell(row, col + 1);
          break;
        case 'Tab':
          if (e.shiftKey) {
            // Shift+Tab: move to previous clue
            navigateToPreviousClue(row, col);
          } else {
            // Tab: move to next clue
            navigateToNextClue();
          }
          break;
        default:
          break;
      }
    }
    // For space key, toggle between across and down when there are multiple clues
    else if (e.key === ' ' && selectedClues.length > 1) {
      e.preventDefault();
      toggleClueDirection();
    }
  }

  // Navigate to a specific cell if valid
  function navigateToCell(row, col) {
    // Check if the target cell is valid
    if (
      row >= 0 &&
      row < size &&
      col >= 0 &&
      col < size &&
      puzzle.grid[row][col] !== ""
    ) {
      handleCellSelect(row, col);
      // Focus the input
      setTimeout(() => {
        const input = document.querySelector(`input[data-key="${row}-${col}"]`);
        if (input) input.focus();
      }, 0);
    }
  }

  // Navigate to the next clue in the puzzle
  function navigateToNextClue() {
    if (highlightedClue) {
      const nextClue = findNextClue(highlightedClue);
      if (nextClue) {
        // Navigate to the start of the next clue
        navigateToCell(nextClue.row, nextClue.col);
        
        // Ensure the right clue is highlighted
        setTimeout(() => {
          const newClue = selectedClues.find(clue => 
            clue.direction === nextClue.direction &&
            clue.number === nextClue.number
          );
          if (newClue) {
            setHighlightedClue(newClue);
          }
        }, 0);
      }
    }
  }

  // Navigate to the previous clue in the puzzle
  function navigateToPreviousClue(row, col) {
    if (highlightedClue) {
      const clueList = highlightedClue.direction === "across" 
        ? [...puzzle.clues.across] 
        : [...puzzle.clues.down];
      
      // Sort clues by number
      clueList.sort((a, b) => a.number - b.number);
      
      // Find the index of the current clue
      const currentIndex = clueList.findIndex(clue => 
        clue.row === highlightedClue.row && 
        clue.col === highlightedClue.col && 
        clue.number === highlightedClue.number
      );
      
      if (currentIndex > 0) {
        // There's a previous clue in the same direction
        const prevClue = {
          ...clueList[currentIndex - 1],
          direction: highlightedClue.direction
        };
        navigateToCell(prevClue.row, prevClue.col);
        
        // Ensure the right clue is highlighted
        setTimeout(() => {
          const newClue = selectedClues.find(clue => 
            clue.direction === prevClue.direction &&
            clue.number === prevClue.number
          );
          if (newClue) {
            setHighlightedClue(newClue);
          }
        }, 0);
      } else if (highlightedClue.direction === "down" && puzzle.clues.across.length > 0) {
        // If at first down clue, go to last across clue
        const acrossClues = [...puzzle.clues.across].sort((a, b) => a.number - b.number);
        const lastAcross = acrossClues[acrossClues.length - 1];
        navigateToCell(lastAcross.row, lastAcross.col);
        
        setTimeout(() => {
          const newClue = selectedClues.find(clue => 
            clue.direction === "across" &&
            clue.number === lastAcross.number
          );
          if (newClue) {
            setHighlightedClue(newClue);
          }
        }, 0);
      } else if (highlightedClue.direction === "across" && puzzle.clues.down.length > 0) {
        // If at first across clue, go to last down clue
        const downClues = [...puzzle.clues.down].sort((a, b) => a.number - b.number);
        const lastDown = downClues[downClues.length - 1];
        navigateToCell(lastDown.row, lastDown.col);
        
        setTimeout(() => {
          const newClue = selectedClues.find(clue => 
            clue.direction === "down" &&
            clue.number === lastDown.number
          );
          if (newClue) {
            setHighlightedClue(newClue);
          }
        }, 0);
      }
    }
  }

  // Toggle between across and down clues for the current cell
  function toggleClueDirection() {
    if (selectedClues.length <= 1) return;
    
    const currentDirection = highlightedClue ? highlightedClue.direction : "across";
    const newDirection = currentDirection === "across" ? "down" : "across";
    
    // Find the clue in the new direction
    const newClue = selectedClues.find(clue => clue.direction === newDirection);
    if (newClue) {
      setHighlightedClue(newClue);
    }
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

              const isCorrectCell =
                puzzleGrid[rIndex][cIndex].toUpperCase() === cell.toUpperCase();
              const isWrongCell = cell !== "" && !isCorrectCell;

              const isSelected =
                selectedCell.row === rIndex && selectedCell.col === cIndex;
              const isInSelectedPath = isPartOfSelectedClue(rIndex, cIndex);
              let cellClassName = isSelected
                ? "bg-primary text-white"
                : isCorrectCell
                ? "bg-success text-white"
                : isWrongCell
                ? "bg-danger text-white"
                : isInSelectedPath
                ? "bg-info-subtle"
                : "bg-light";

              return (
                <Input
                  key={`${rIndex}-${cIndex}`}
                  data-key={`${rIndex}-${cIndex}`}
                  type="text"
                  value={cell}
                  onChange={(e) => handleChange(rIndex, cIndex, e.target.value)}
                  onClick={() => handleCellSelect(rIndex, cIndex)}
                  onFocus={() => handleCellSelect(rIndex, cIndex)}
                  onKeyDown={(e) => handleKeyDown(rIndex, cIndex, e)}
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

// Utility moved to context
