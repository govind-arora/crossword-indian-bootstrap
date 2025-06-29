export default function CluesList({ clues, selectedClues }) {
  const acrossClues = selectedClues.filter((c) => c.direction === "across");
  const downClues = selectedClues.filter((c) => c.direction === "down");

  return (
    <div className="p-4">
      {acrossClues.length > 0 && (
        <div className="mb-4">
          <h3 className="fw-semibold text-decoration-underline mb-1">Across</h3>
          <ul className="ps-0 mb-0">
            {acrossClues.map((clue) => (
              <li key={`across-${clue.number}`} className="mb-2 list-unstyled">
                {clue.clue} ({clue.answer.length})
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
              <li key={`down-${clue.number}`} className="mb-2 list-unstyled">
                {clue.clue} ({clue.answer.length})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
