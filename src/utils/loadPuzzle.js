export async function loadPuzzle(size, date) {
  const puzzle = await import(`../puzzles/${size}/${date}.json`);
  return puzzle.default;
}