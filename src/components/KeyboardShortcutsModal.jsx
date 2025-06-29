import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Table } from 'reactstrap';

export default function KeyboardShortcutsModal({ isOpen, toggle }) {
  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>
        Keyboard Shortcuts
      </ModalHeader>
      <ModalBody>
        <p>Use these keyboard shortcuts to navigate and solve puzzles more efficiently:</p>
        
        <Table bordered>
          <thead>
            <tr>
              <th width="40%">Key</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><kbd>Arrow keys</kbd></td>
              <td>Navigate through the grid in the corresponding direction</td>
            </tr>
            <tr>
              <td><kbd>Space</kbd></td>
              <td>Toggle between across and down clues for the current cell</td>
            </tr>
            <tr>
              <td><kbd>Tab</kbd></td>
              <td>Move to the next clue in the puzzle</td>
            </tr>
            <tr>
              <td><kbd>Shift</kbd> + <kbd>Tab</kbd></td>
              <td>Move to the previous clue in the puzzle</td>
            </tr>
            <tr>
              <td><kbd>Backspace</kbd> / <kbd>Delete</kbd></td>
              <td>Clear the current cell and move to the previous cell in the current direction</td>
            </tr>
            <tr>
              <td><kbd>Letter keys</kbd></td>
              <td>Enter a letter and advance to the next cell automatically</td>
            </tr>
          </tbody>
        </Table>
        
        <h5 className="mt-4">Game Controls</h5>
        <ul>
          <li><strong>Reset Button:</strong> Clears the grid while keeping the same puzzle</li>
          <li><strong>Hint Button:</strong> Reveals the correct letter for the currently selected cell</li>
          <li><strong>Exit Button:</strong> Returns to the size selection screen</li>
        </ul>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={toggle}>Got it!</Button>
      </ModalFooter>
    </Modal>
  );
}
