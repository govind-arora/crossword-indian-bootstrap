import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Row,
  Col,
} from "reactstrap";
import { usePuzzle } from "../context/PuzzleContext";

export default function SizeSelector() {
  const { size, setSize } = usePuzzle();
  const sizes = [
    { value: "5x5", difficulty: "Easy", description: "Perfect for beginners" },
    { value: "7x7", difficulty: "Medium", description: "For casual solvers" },
    { value: "9x9", difficulty: "Hard", description: "For crossword experts" },
  ];

  // Calculate stats for each size
  const calculateStats = (sizeValue) => {
    const stats = JSON.parse(localStorage.getItem("crosswordStats") || "{}");

    const puzzlesForSize = Object.values(stats).filter(
      (puzzle) => puzzle.size === sizeValue
    );
    return {
      completed: puzzlesForSize.length,
      avgTime:
        puzzlesForSize.length > 0
          ? Math.round(
              puzzlesForSize.reduce((acc, p) => acc + p.timeSeconds, 0) /
                puzzlesForSize.length
            )
          : 0,
    };
  };

  // Format time in minutes and seconds
  const formatTime = (seconds) => {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <Container>
      <div className="text-center mb-5">
        <h1 className="display-4 mb-3">Daily Crossword Challenge</h1>
        <p className="lead">Choose a difficulty level to begin your puzzle</p>
      </div>

      <Row className="justify-content-center mb-5">
        {sizes.map((s) => {
          const sizeStats = calculateStats(s.value);

          return (
            <Col sm={4} key={s.value} className="mb-4">
              <Card
                className={`shadow-sm h-100 ${
                  size === s.value ? "border-primary" : ""
                }`}
                style={{ cursor: "pointer" }}
                onClick={() => setSize(s.value)}
              >
                <CardHeader
                  className={`text-center ${
                    size === s.value ? "bg-primary text-white" : ""
                  }`}
                >
                  <h4 className="my-1">{s.value}</h4>
                </CardHeader>
                <CardBody className="d-flex flex-column">
                  <div className="text-center mb-3">
                    <span className="badge bg-secondary mb-2">
                      {s.difficulty}
                    </span>
                    <h5>Puzzle Size: {s.value}</h5>
                    <p className="text-muted small mb-3">{s.description}</p>
                  </div>

                  <div className="mt-auto">
                    <div className="d-flex justify-content-between small text-muted mb-2">
                      <span>Completed:</span>
                      <span>{sizeStats.completed}</span>
                    </div>
                    <div className="d-flex justify-content-between small text-muted mb-3">
                      <span>Avg. Time:</span>
                      <span>{formatTime(sizeStats.avgTime)}</span>
                    </div>

                    <Button color="outline-primary" className="w-100">
                      Choose This Size
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          );
        })}
      </Row>

      <div className="text-center mt-4">
        <p className="text-muted small">
          New puzzles available daily at midnight. Your progress is
          automatically saved.
        </p>
      </div>
    </Container>
  );
}
