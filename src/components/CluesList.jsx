export default function CluesList({ clues, selectedClues }) {
  if (!clues) return null;

  // If no cell is selected, show all clues
  const showAllClues = !selectedClues || selectedClues.length === 0;
  
  // Filter clues based on selection
  const acrossClues = showAllClues 
    ? clues.across 
    : clues.across.filter(clue => 
        selectedClues.some(sc => (sc.number === clue.number && !sc.direction) || sc.direction === 'across'));
        
  const downClues = showAllClues 
    ? clues.down 
    : clues.down.filter(clue => 
        selectedClues.some(sc => (sc.number === clue.number && !sc.direction) || sc.direction === 'down'));

  return (
    <div className="p-4">
      <h2 className="fw-semibold mb-2">Clues</h2>
      
      {acrossClues.length > 0 && (
        <div className="mb-4">
          <h3 className="fw-semibold text-decoration-underline mb-1">Across</h3>
          <ul className="ps-0 mb-0">
            {acrossClues.map((clue) => (
              <li 
                key={`across-${clue.number}`} 
                className={`mb-2 list-unstyled ${!showAllClues ? 'fw-bold' : ''}`}
              >
                <span className="fw-bold">{clue.number}.</span> {clue.clue}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {downClues.length > 0 && (
        <div>
          <h3 className="fw-semibold text-decoration-underline mb-1">Down</h3>
          <ul className="ps-0 mb-0">
            {downClues.map((clue) => (
              <li 
                key={`down-${clue.number}`} 
                className={`mb-2 list-unstyled ${!showAllClues ? 'fw-bold' : ''}`}
              >
                <span className="fw-bold">{clue.number}.</span> {clue.clue}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {!showAllClues && acrossClues.length === 0 && downClues.length === 0 && (
        <div className="text-center text-muted">
          <p>No clues for selected cell</p>
        </div>
      )}
    </div>
  );
}