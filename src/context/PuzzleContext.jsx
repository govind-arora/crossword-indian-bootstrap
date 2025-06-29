import React, { createContext, useContext, useState, useEffect } from "react";
import { loadPuzzle } from "../utils/loadPuzzle";

const PuzzleContext = createContext();

export function usePuzzle() {
  return useContext(PuzzleContext);
}

export function PuzzleProvider({ children }) {
  const [size, setSize] = useState("");
  const [puzzle, setPuzzle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCell, setSelectedCell] = useState({ row: null, col: null });
  const [selectedClues, setSelectedClues] = useState([]);
  const [highlightedClue, setHighlightedClue] = useState(null);
  const [grid, setGrid] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);

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

  // Load puzzle when size changes
  useEffect(() => {
    if (!size) return;
    
    const loadPuzzleData = async () => {
      setLoading(true);
      setError(null);
      try {
        const today = new Date().toISOString().slice(0, 10);
        const puzzleData = await loadPuzzle(size, today);
        setPuzzle(puzzleData);
        setGrid(generateEmptyGrid(parseInt(size.split('x')[0])));
        // Start timer when puzzle is loaded
        setStartTime(Date.now());
      } catch (err) {
        setError("Failed to load puzzle. Please try again.");
        console.error("Error loading puzzle:", err);
      } finally {
        setLoading(false);
      }
    };
    
    loadPuzzleData();
  }, [size]);

  // Check if puzzle is complete
  useEffect(() => {
    if (!puzzle || !grid.length) return;

    const isPuzzleComplete = grid.every((row, rowIndex) =>
      row.every((cell, colIndex) => {
        // Skip black cells
        if (puzzle.grid[rowIndex][colIndex] === "") return true;
        // Check if cell is filled correctly
        return cell.toUpperCase() === puzzle.grid[rowIndex][colIndex].toUpperCase();
      })
    );

    if (isPuzzleComplete && !isComplete) {
      setIsComplete(true);
      
      // Save stats when puzzle is complete
      const saveCompletionStats = () => {
        const stats = JSON.parse(localStorage.getItem('crosswordStats') || '{}');
        const puzzleKey = `${puzzle.date}-${size}`;
        
        stats[puzzleKey] = {
          date: puzzle.date,
          size,
          timeSeconds: elapsedTime,
          hintsUsed,
          completedAt: new Date().toISOString()
        };
        
        localStorage.setItem('crosswordStats', JSON.stringify(stats));
      };
      
      saveCompletionStats();
    }
  }, [grid, puzzle, isComplete, size, elapsedTime, hintsUsed]);

  function generateEmptyGrid(size) {
    return Array.from({ length: size }, () => Array(size).fill(""));
  }

  function resetPuzzle() {
    if (!size) return;
    setGrid(generateEmptyGrid(parseInt(size.split('x')[0])));
    setSelectedCell({ row: null, col: null });
    setSelectedClues([]);
    setHighlightedClue(null);
    setStartTime(Date.now());
    setElapsedTime(0);
    setIsComplete(false);
    setHintsUsed(0);
  }

  function getHint() {
    if (!puzzle || !selectedCell.row !== null) return;
    
    const { row, col } = selectedCell;
    if (puzzle.grid[row][col] === "") return; // Don't give hints for black cells
    
    const newGrid = [...grid];
    newGrid[row][col] = puzzle.grid[row][col];
    setGrid(newGrid);
    setHintsUsed(prev => prev + 1);
  }

  // Function moved inside useEffect

  const value = {
    size,
    setSize,
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
    setGrid,
    elapsedTime,
    isComplete,
    showHints,
    setShowHints,
    hintsUsed,
    resetPuzzle,
    getHint,
  };

  return (
    <PuzzleContext.Provider value={value}>
      {children}
    </PuzzleContext.Provider>
  );
}
