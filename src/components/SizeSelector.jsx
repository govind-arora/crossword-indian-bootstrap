import { Button, ButtonGroup } from "reactstrap";

export default function SizeSelector({ size, setSize }) {
  const sizes = ["5x5", "7x7", "9x9"];

  return (
    <div className="d-flex justify-content-center mb-4">
      <ButtonGroup>
        {sizes.map((s) => (
          <Button
            key={s}
            onClick={() => setSize(s)}
            color={size === s ? "primary" : "secondary"}
            outline={size !== s}
            className="mx-1"
          >
            {s}
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );
}