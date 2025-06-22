import { useState, useEffect } from "react";
import { Card, CardBody, CardTitle, Input } from "reactstrap";

export default function CrosswordGrid({ size, puzzle }) {
  const [grid, setGrid] = useState(generateEmptyGrid(size));

  useEffect(() => {
    setGrid(generateEmptyGrid(size));
  }, [size]);

  function handleChange(row, col, value) {
    const newGrid = [...grid];
    newGrid[row][col] = value.slice(-1).toUpperCase();
    setGrid(newGrid);
  }

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${parseInt(size)}, 2.5rem)`,
    gap: "0.25rem",
  };

  const cellStyle = {
    width: "2.5rem",
    height: "2.5rem",
    textAlign: "center",
    textTransform: "uppercase",
    fontSize: "1.25rem",
    fontWeight: "600",
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

              return (
                <Input
                  key={`${rowIndex}-${colIndex}`}
                  type="text"
                  maxLength={1}
                  value={cell}
                  onChange={(e) =>
                    handleChange(rowIndex, colIndex, e.target.value)
                  }
                  style={cellStyle}
                  className={isBlackCell ? "bg-dark text-white" : "bg-light"}
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
