import React from "react";
import { Button, Card, CardBody, CardHeader, Container, Row, Col } from "reactstrap";
import { usePuzzle } from "../context/PuzzleContext";

export default function SizeSelector() {
  const { size, setSize } = usePuzzle();
  const sizes = ["5x5", "7x7", "9x9"];

  // Get stats from local storage
  const stats = JSON.parse(localStorage.getItem('crosswordStats') || '{}');

  // Calculate stats for each size
  const calculateStats = (sizeValue) => {
    const puzzlesForSize = Object.values(stats).filter(puzzle => puzzle.size === sizeValue);
    return {
      completed: puzzlesForSize.length,
      avgTime: puzzlesForSize.length > 0 
        ? Math.round(puzzlesForSize.reduce((acc, p) => acc + p.timeSeconds, 0) / puzzlesForSize.length)
        : 0
    };
  };

  // Format time in minutes and seconds
  const formatTime = (seconds) => {
    if (!seconds) return 'N/A';
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
          const sizeStats = calculateStats(s);
          const difficulty = s === "5x5" ? "Easy" : s === "7x7" ? "Medium" : "Hard";
          
          return (
            <Col sm={4} key={s} className="mb-4">
              <Card 
                className={`shadow-sm h-100 ${size === s ? 'border-primary' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => setSize(s)}
              >
                <CardHeader className={`text-center ${size === s ? 'bg-primary text-white' : ''}`}>
                  <h4 className="my-1">{s}</h4>
                </CardHeader>
                <CardBody className="d-flex flex-column">
                  <div className="text-center mb-3">
                    <span className="badge bg-secondary mb-2">{difficulty}</span>
                    <h5>Puzzle Size: {s}</h5>
                    <p className="text-muted small mb-3">
                      {s === "5x5" ? "Perfect for beginners" : 
                       s === "7x7" ? "For casual solvers" : 
                       "For crossword experts"}
                    </p>
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
                    
                    <Button
                      color={size === s ? "primary" : "outline-primary"}
                      className="w-100"
                    >
                      {size === s ? "Selected" : "Choose This Size"}
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
          New puzzles available daily at midnight. Your progress is automatically saved.
        </p>
      </div>
    </Container>
  );
}