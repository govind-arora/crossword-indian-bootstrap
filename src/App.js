import React, { useState } from 'react';

import Crossword from './views/Crossword';

export default function App() {
  const [game] = useState('crossword');
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="container py-4">
      {game === 'crossword' && (
        <Crossword today={today} />
      )}
    </div>
  );
}
