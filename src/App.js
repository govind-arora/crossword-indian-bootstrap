import React, { useEffect, useState } from 'react';

import { loadPuzzle } from './utils/loadPuzzle';
import Header from './components/Header';
import SizeSelector from './components/SizeSelector';
import Crossword from './components/Crossword';

export default function App() {
  const [size, setSize] = useState("7x7");
  const [puzzle, setPuzzle] = useState(null);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    loadPuzzle(size, today).then(setPuzzle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size]);

  return (
    <div className="container py-4">
      <Header date={today} />
      <SizeSelector size={size} setSize={setSize} />

      {puzzle && puzzle.size === size && (
          <Crossword puzzle={puzzle} size={size} />
      )}
    </div>
  );
}
