export default function CluesList({ clues }) {
  if (!clues) return null;

  return (
    <div className="p-4 bg-light rounded shadow-sm w-100">
      <h2 className="fw-semibold mb-2">Clues</h2>
      <div className="mb-4">
        <h3 className="fw-semibold text-decoration-underline mb-1">Across</h3>
        <ul className="ps-0 mb-0">
          {clues.across.map((clue) => (
            <li key={`across-${clue.number}`} className="mb-2 list-unstyled">
              <span className="fw-bold">{clue.number}.</span> {clue.clue}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="fw-semibold text-decoration-underline mb-1">Down</h3>
        <ul className="ps-0 mb-0">
          {clues.down.map((clue) => (
            <li key={`down-${clue.number}`} className="mb-2 list-unstyled">
              <span className="fw-bold">{clue.number}.</span> {clue.clue}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}