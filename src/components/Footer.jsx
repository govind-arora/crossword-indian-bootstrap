import React from "react";
import { Container } from "reactstrap";

const Footer = ({ handleModalOpen }) => {
  return (
    <footer className="bg-light py-3 mt-auto">
      <Container>
        <div className="d-flex justify-content-between align-items-center small">
          <div>
            <span className="text-muted">
              © {new Date().getFullYear()} Daily Crossword
            </span>
          </div>
          <div>
            <a
              href="#keyboard-shortcuts"
              className="text-decoration-none me-3"
              onClick={() => handleModalOpen("keyboardShortcuts")}
            >
              Keyboard Shortcuts
            </a>
            <a
              href="#puzzle-stats"
              className="text-decoration-none"
              onClick={() => handleModalOpen("stats")}
            >
              Stats
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
