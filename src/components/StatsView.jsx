import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Card, 
  CardBody, 
  Table, 
  Modal, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  Container,
  Row,
  Col,
  Badge
} from 'reactstrap';

export default function StatsView() {
  const [stats, setStats] = useState({});
  const [showModal, setShowModal] = useState(false);
  
  useEffect(() => {
    // Load stats from localStorage
    const savedStats = JSON.parse(localStorage.getItem('crosswordStats') || '{}');
    setStats(savedStats);
  }, []);
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const formatTime = (seconds) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };
  
  const clearStats = () => {
    localStorage.removeItem('crosswordStats');
    setStats({});
    setShowModal(false);
  };
  
  // Group puzzles by size
  const puzzlesBySizeAndDate = Object.values(stats).reduce((acc, puzzle) => {
    acc[puzzle.size] = acc[puzzle.size] || [];
    acc[puzzle.size].push(puzzle);
    return acc;
  }, {});
  
  // Calculate summary stats
  const totalCompleted = Object.values(stats).length;
  const avgTime = totalCompleted > 0 
    ? Math.round(
        Object.values(stats).reduce((acc, puzzle) => acc + puzzle.timeSeconds, 0) / totalCompleted
      )
    : 0;
  const totalHints = Object.values(stats).reduce((acc, puzzle) => acc + puzzle.hintsUsed, 0);
  
  return (
    <Container className="py-5">
      <h2 className="mb-4 text-center">Puzzle Statistics</h2>
      
      {/* Summary Cards */}
      <Row className="mb-5">
        <Col md={4}>
          <Card className="text-center shadow-sm mb-3">
            <CardBody>
              <h3 className="text-primary">{totalCompleted}</h3>
              <p className="text-muted mb-0">Total Puzzles Solved</p>
            </CardBody>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-sm mb-3">
            <CardBody>
              <h3 className="text-primary">{formatTime(avgTime)}</h3>
              <p className="text-muted mb-0">Average Completion Time</p>
            </CardBody>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-sm mb-3">
            <CardBody>
              <h3 className="text-primary">{totalHints}</h3>
              <p className="text-muted mb-0">Total Hints Used</p>
            </CardBody>
          </Card>
        </Col>
      </Row>
      
      {/* Stats By Size */}
      {Object.keys(puzzlesBySizeAndDate).map(size => {
        const puzzles = puzzlesBySizeAndDate[size].sort(
          (a, b) => new Date(b.completedAt) - new Date(a.completedAt)
        );
        
        return (
          <div key={size} className="mb-5">
            <h4 className="mb-3">
              <Badge color="primary" className="me-2">{size}</Badge> 
              Puzzles
            </h4>
            
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Puzzle</th>
                    <th>Completion Time</th>
                    <th>Hints Used</th>
                  </tr>
                </thead>
                <tbody>
                  {puzzles.map((puzzle, idx) => (
                    <tr key={idx}>
                      <td>{formatDate(puzzle.date)}</td>
                      <td>{puzzle.size}</td>
                      <td>{formatTime(puzzle.timeSeconds)}</td>
                      <td>{puzzle.hintsUsed}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        );
      })}
      
      {Object.keys(stats).length === 0 && (
        <div className="text-center py-5 text-muted">
          <p>No puzzles completed yet. Start playing to see your statistics!</p>
        </div>
      )}
      
      <div className="text-center mt-5">
        {Object.keys(stats).length > 0 && (
          <Button color="danger" onClick={() => setShowModal(true)}>
            Clear Statistics
          </Button>
        )}
      </div>
      
      {/* Confirmation Modal */}
      <Modal isOpen={showModal} toggle={() => setShowModal(!showModal)}>
        <ModalHeader toggle={() => setShowModal(!showModal)}>Clear All Statistics?</ModalHeader>
        <ModalBody>
          Are you sure you want to delete all your puzzle statistics? This action cannot be undone.
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button color="danger" onClick={clearStats}>Clear All Statistics</Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
}
