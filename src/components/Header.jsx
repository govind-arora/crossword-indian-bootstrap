import React from "react";
import { Button, Navbar, NavbarBrand, Nav, NavItem } from "reactstrap";
import { usePuzzle } from "../context/PuzzleContext";
import { formatTime } from "../helpers/Utils";

export default function Header() {
  const { size, handleSetSize, handleResetPuzzle, elapsedTime } = usePuzzle();

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
                {formatTime(elapsedTime)}
              </div>
            </NavItem>
            <NavItem className="me-2">
              <Button
                color="light"
                size="sm"
                outline
                onClick={() => handleResetPuzzle()}
              >
                Reset
              </Button>
            </NavItem>
            <NavItem>
              <Button
                color="danger"
                size="sm"
                outline
                onClick={() => handleSetSize("")}
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
