import React from "react";
import { 
  Card, 
  CardBody, 
  Row, 
  Col, 
  Alert, 
  Button, 
  Modal, 
  ModalHeader, 
  ModalBody, 
  ModalFooter 
} from "reactstrap";

import { formatTime } from "../helpers/Utils";
import { usePuzzle } from "../context/PuzzleContext";

import Grid from "./Grid";
import CluesList from "./CluesList";

export default function Puzzle() {
  const { 
    puzzle, 
    loading, 
    error, 
    isComplete, 
    elapsedTime,
    resetPuzzle
  } = usePuzzle();
  
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  
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
      <div className="d-flex justify-content-center mb-4">
        <h3 className="text-primary mb-0">Theme: {puzzle.theme}</h3>
      </div>

      {/* Main Game Area */}
      <Row>
        <Col lg={7} className="mb-4 mb-lg-0">
          <Grid />
        </Col>

        <Col lg={5}>
          <Card className="shadow-sm">
            <CardBody>
              <CluesList />
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Completion Modal */}
      <Modal
        isOpen={isModalOpen}
        toggle={() => setIsModalOpen(!isModalOpen)}
        centered
      >
        <ModalHeader
          toggle={() => setIsModalOpen(!isModalOpen)}
          className="bg-success text-white"
        >
          Congratulations! 🎉
        </ModalHeader>
        <ModalBody>
          <div className="text-center my-4">
            <h3>You completed the puzzle!</h3>
            <p className="mb-0">Time: {formatTime(elapsedTime)}</p>
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
