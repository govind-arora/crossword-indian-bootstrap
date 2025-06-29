import React from "react";
import { 
  Card, 
  CardBody, 
  Row, 
  Col, 
  Progress, 
  Alert, 
  Button, 
  Modal, 
  ModalHeader, 
  ModalBody, 
  ModalFooter 
} from "reactstrap";
import { usePuzzle } from "../context/PuzzleContext";
import CrosswordGrid from "./CrosswordGrid";
import CluesList from "./CluesList";

export default function Puzzle() {
  const { 
    puzzle, 
    size, 
    loading, 
    error, 
    isComplete, 
    elapsedTime,
    hintsUsed,
    setShowHints,
    showHints,
    resetPuzzle
  } = usePuzzle();
  
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  
  // Calculate completion percentage
  const calculateCompletion = () => {
    if (!puzzle) return 0;
    
    // Count filled cells
    let totalCells = 0;
    let filledCells = 0;
    
    const gridSize = parseInt(size.split('x')[0]);
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (puzzle.grid[r][c] !== "") {
          totalCells++;
          // Check if the cell in our grid is filled (not empty)
          if (document.querySelector(`input[data-key="${r}-${c}"]`)?.value) {
            filledCells++;
          }
        }
      }
    }
    
    return totalCells > 0 ? Math.round((filledCells / totalCells) * 100) : 0;
  };
  
  // Format the time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };
  
  // Toggle completion modal
  React.useEffect(() => {
    if (isComplete) {
      setIsModalOpen(true);
    }
  }, [isComplete]);
  
  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading puzzle...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert color="danger" className="my-4">
        {error}
      </Alert>
    );
  }
  
  if (!puzzle) {
    return null;
  }
  
  return (
    <div className="container py-4">
      {/* Theme and Progress Section */}
      <div className="mb-4">
        <Row className="align-items-center">
          <Col md={6}>
            <h3 className="text-primary mb-0">
              Theme: {puzzle.theme}
            </h3>
          </Col>
          <Col md={6}>
            <div className="d-flex align-items-center justify-content-end">
              <div className="me-3">
                <Button 
                  color={showHints ? "warning" : "secondary"}
                  size="sm"
                  onClick={() => setShowHints(!showHints)}
                >
                  {showHints ? "Hints On" : "Hints Off"}
                </Button>
              </div>
              <div className="text-end">
                <small className="text-muted d-block">Progress</small>
                <Progress 
                  value={calculateCompletion()} 
                  className="mt-1" 
                  style={{ height: '8px' }}
                />
              </div>
            </div>
          </Col>
        </Row>
      </div>
      
      {/* Main Game Area */}
      <Row>
        <Col lg={7} className="mb-4 mb-lg-0">
          <CrosswordGrid />
        </Col>
        
        <Col lg={5}>
          <Card className="shadow-sm">
            <CardBody>
              <CluesList />
            </CardBody>
          </Card>
          
          <div className="mt-4">
            <Card className="bg-light">
              <CardBody>
                <h5 className="card-title">🎮 Game Controls</h5>
                <ul className="small mb-0 ps-3">
                  <li>Arrow keys: Navigate through the grid</li>
                  <li>Space: Toggle between across/down</li>
                  <li>Tab/Shift+Tab: Move to next/previous clue</li>
                </ul>
              </CardBody>
            </Card>
          </div>
        </Col>
      </Row>
      
      {/* Completion Modal */}
      <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(!isModalOpen)} centered>
        <ModalHeader toggle={() => setIsModalOpen(!isModalOpen)} className="bg-success text-white">
          Congratulations! 🎉
        </ModalHeader>
        <ModalBody>
          <div className="text-center my-4">
            <h3>You completed the puzzle!</h3>
            <p className="mb-0">Time: {formatTime(elapsedTime)}</p>
            <p>Hints used: {hintsUsed}</p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setIsModalOpen(false)}>
            Close
          </Button>
          <Button color="primary" onClick={resetPuzzle}>
            Play Again
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
