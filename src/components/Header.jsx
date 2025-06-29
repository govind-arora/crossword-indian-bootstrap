import React from "react";
import { Button, Navbar, NavbarBrand, Nav, NavItem } from "reactstrap";
import { usePuzzle } from "../context/PuzzleContext";

export default function Header() {
  const { size, setSize, resetPuzzle, elapsedTime } = usePuzzle();

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  return (
    <header>
      <Navbar color="primary" dark expand className="px-3 shadow">
        <NavbarBrand href="/" className="fw-bold">
          🧩 Daily Crossword
        </NavbarBrand>
        
        {size && (
          <Nav className="ms-auto d-flex align-items-center" navbar>
            <NavItem className="me-3">
              <div className="bg-dark text-white py-1 px-3 rounded">
                Timer: {formatTime(elapsedTime)}
              </div>
            </NavItem>
            <NavItem className="me-2">
              <Button 
                color="light" 
                size="sm" 
                outline 
                onClick={() => resetPuzzle()}
              >
                Reset
              </Button>
            </NavItem>
            <NavItem>
              <Button 
                color="danger" 
                size="sm" 
                outline 
                onClick={() => setSize("")}
              >
                Exit
              </Button>
            </NavItem>
          </Nav>
        )}
      </Navbar>
    </header>
  );
}