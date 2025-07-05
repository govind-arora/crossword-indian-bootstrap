import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Col,
  Badge,
} from "reactstrap";

export default function StatsView({ isOpen, toggle }) {
  const [stats, setStats] = useState({});

  useEffect(() => {
    // Load stats from localStorage
    const savedStats = JSON.parse(
      localStorage.getItem("crosswordStats") || "{}"
    );
    setStats(savedStats);
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (seconds) => {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Group puzzles by size
  const puzzlesBySizeAndDate = Object.values(stats).reduce((acc, puzzle) => {
    acc[puzzle.size] = acc[puzzle.size] || [];
    acc[puzzle.size].push(puzzle);
    return acc;
  }, {});

  // Calculate summary stats
  const totalCompleted = Object.values(stats).length;
  const avgTime =
    totalCompleted > 0
      ? Math.round(
          Object.values(stats).reduce(
            (acc, puzzle) => acc + puzzle.timeSeconds,
            0
          ) / totalCompleted
        )
      : 0;

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>Puzzle Statistics</ModalHeader>

      <ModalBody>
        {/* Summary Cards */}
        <Row className="mb-5">
          <Col md={6}>
            <Card className="text-center shadow-sm mb-3">
              <CardBody>
                <h3 className="text-primary">{totalCompleted}</h3>
                <p className="text-muted mb-0">Total Puzzles Solved</p>
              </CardBody>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="text-center shadow-sm mb-3">
              <CardBody>
                <h3 className="text-primary">{formatTime(avgTime)}</h3>
                <p className="text-muted mb-0">Average Completion Time</p>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Stats By Size */}
        {Object.keys(puzzlesBySizeAndDate).map((size) => {
          const puzzles = puzzlesBySizeAndDate[size].sort(
            (a, b) => new Date(b.completedAt) - new Date(a.completedAt)
          );

          return (
            <div key={size} className="mb-5">
              <h4 className="mb-3">
                <Badge color="primary" className="me-2">
                  {size}
                </Badge>
                Puzzles
              </h4>

              <div className="table-responsive">
                <Table hover>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Puzzle</th>
                      <th>Completion Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {puzzles.map((puzzle, idx) => (
                      <tr key={idx}>
                        <td>{formatDate(puzzle.date)}</td>
                        <td>{puzzle.size}</td>
                        <td>{formatTime(puzzle.timeSeconds)}</td>
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
            <p>
              No puzzles completed yet. Start playing to see your statistics!
            </p>
          </div>
        )}
      </ModalBody>
    </Modal>
  );
}
