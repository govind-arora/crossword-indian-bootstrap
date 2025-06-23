import { Button, ButtonGroup } from "reactstrap";

export default function SizeSelector({ size, setSize }) {
  const sizes = ["5x5", "7x7", "9x9"];

  return (
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "50vh" }}>
      <h3 className="mb-4">Select Crossword Size</h3>
      <ButtonGroup>
        {sizes.map((s) => (
          <Button
            key={s}
            onClick={() => setSize(s)}
            color={size === s ? "primary" : "secondary"}
            outline={size !== s}
            className="mx-2 px-4 py-2"
            size="lg"
          >
            {s}
          </Button>
        ))}
      </ButtonGroup>
      <div className="mt-4 text-muted">
        <small>Choose a grid size to continue</small>
      </div>
    </div>
  );
}