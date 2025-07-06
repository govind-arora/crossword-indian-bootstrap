import React, { createContext, useContext, useState, useEffect } from "react";
import { loadPuzzle } from "../helpers/Utils";

const PuzzleContext = createContext();

export function usePuzzle() {
  return useContext(PuzzleContext);
}

export function PuzzleProvider({ children }) {
  const [size, setSize] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const [grid, setGrid] = useState([]);
  const [puzzle, setPuzzle] = useState(null);
  const [selectedClues, setSelectedClues] = useState([]);
  const [highlightedClue, setHighlightedClue] = useState(null);
  const [selectedCell, setSelectedCell] = useState({ row: null, col: null });

  const generateEmptyGrid = (size) => {
    return Array.from({ length: size }, () => Array(size).fill(""));
  };

  // Load Puzzle function
  const handleLoadPuzzle = async (newSize) => {
    setLoading(true);
    setError(null);
    try {
      const today = new Date().toISOString().slice(0, 10);
      const puzzleData = await loadPuzzle(newSize, today);
      setPuzzle(puzzleData);
      setGrid(generateEmptyGrid(parseInt(newSize.split("x")[0])));
      // Start timer when puzzle is loaded
      setStartTime(Date.now());
    } catch (err) {
      setError("Failed to load puzzle. Please try again.");
      console.error("Error loading puzzle:", err);
    } finally {
      setLoading(false);
    }
  };

  // Save stats when puzzle is complete
  const handleSaveResult = () => {
    const stats = JSON.parse(localStorage.getItem("crosswordStats") || "{}");
    const puzzleKey = `${puzzle.date}-${size}`;

    stats[puzzleKey] = {
      date: puzzle.date,
      size,
      timeSeconds: elapsedTime,
      completedAt: new Date().toISOString(),
    };

    localStorage.setItem("crosswordStats", JSON.stringify(stats));
  };

  // Timer functionality
  useEffect(() => {
    let interval;
    if (startTime && !isComplete) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime, isComplete]);

  // Handle SetSize
  const handleSetSize = (newSize) => {
    setSize(newSize);
    handleLoadPuzzle(newSize);
  };

  const handleChangeGrid = (newGrid) => {
    setGrid(newGrid);

    const isPuzzleComplete = newGrid.every((row, rowIndex) =>
      row.every((cell, colIndex) => {
        // Skip black cells
        if (puzzle.grid[rowIndex][colIndex] === "") return true;
        // Check if cell is filled correctly
        return (
          cell.toUpperCase() === puzzle.grid[rowIndex][colIndex].toUpperCase()
        );
      })
    );

    if (isPuzzleComplete && !isComplete) {
      setIsComplete(true);
      handleSaveResult();
    }
  }

  // Function moved inside useEffect
  const value = {
    size,
    handleSetSize,
    puzzle,
    loading,
    error,
    selectedCell,
    setSelectedCell,
    selectedClues,
    setSelectedClues,
    highlightedClue,
    setHighlightedClue,
    grid,
    handleChangeGrid,
    elapsedTime,
    isComplete,
    handleResetPuzzle: () => handleLoadPuzzle(size),
  };

  return (
    <PuzzleContext.Provider value={value}>{children}</PuzzleContext.Provider>
  );
}
