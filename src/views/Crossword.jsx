import React, { useEffect, useState } from "react";

import { loadPuzzle } from "../utils/loadPuzzle";

import Header from "../components/Header";
import Puzzle from "../components/Puzzle";
import SizeSelector from "../components/SizeSelector";

export default function Crossword({ today }) {
  const [size, setSize] = useState("");
  const [puzzle, setPuzzle] = useState(null);

  useEffect(() => {
    if (!size) return;
    setPuzzle(null); // Reset puzzle when size changes
    loadPuzzle(size, today).then(setPuzzle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size]);

  return (
    <div className="container mx-auto max-w-4xl px-4">
      {size ? (
        <div>
          <Header date={today} />

          {puzzle && puzzle.size === size && (
            <Puzzle puzzle={puzzle} size={size} />
          )}
        </div>
      ) : (
        <SizeSelector size={size} setSize={setSize} />
      )}
    </div>
  );
}
