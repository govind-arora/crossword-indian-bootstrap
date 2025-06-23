export default function CluesList({ clues, selectedClues }) {
  const acrossClues = selectedClues.filter(clue => clue.direction === 'across');
  const downClues = selectedClues.filter(clue => clue.direction === 'down');

  return (
    <div className="p-4">
      <h2 className="fw-semibold mb-2">Clues</h2>
      
      {selectedClues.length > 0 && (
        <div className="mb-4">
          <h3 className="fw-semibold text-decoration-underline mb-1">Across</h3>
          <ul className="ps-0 mb-0">
            {acrossClues.map((clue) => (
              <li 
                key={`across-${clue.number}`} 
                className="mb-2 list-unstyled"
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
                className="mb-2 list-unstyled"
              >
                <span className="fw-bold">{clue.number}.</span> {clue.clue}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}