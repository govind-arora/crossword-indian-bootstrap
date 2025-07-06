export const loadPuzzle = async (size, date) => {
  const puzzle = await import(`../puzzles/${size}/${date}.json`);
  return puzzle.default;
};

// Format the time for display
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};
