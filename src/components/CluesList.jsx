import React from "react";
import { Button, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import { usePuzzle } from "../context/PuzzleContext";

export default function CluesList() {
  const { 
    puzzle, 
    selectedClues, 
    highlightedClue, 
    setHighlightedClue, 
    getHint, 
    showHints,
    hintsUsed 
  } = usePuzzle();
  
  const [activeTab, setActiveTab] = React.useState('across');
  
  // Get selected clues by direction
  const acrossClues = selectedClues.filter((c) => c.direction === "across");
  const downClues = selectedClues.filter((c) => c.direction === "down");
  
  // Handle clue selection
  const handleClueClick = (clue) => {
    setHighlightedClue(clue);
  };
  
  // Get all clues for all tabs display
  const allAcrossClues = puzzle?.clues?.across || [];
  const allDownClues = puzzle?.clues?.down || [];
  
  // Check if a clue is highlighted
  const isHighlighted = (clue) => {
    return highlightedClue && 
      highlightedClue.direction === clue.direction && 
      highlightedClue.number === clue.number;
  };
  
  return (
    <div className="clues-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <Nav tabs>
            <NavItem>
              <NavLink
                className={activeTab === 'across' ? 'active bg-primary text-white' : ''}
                onClick={() => setActiveTab('across')}
                style={{ cursor: 'pointer' }}
              >
                Across
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === 'down' ? 'active bg-primary text-white' : ''}
                onClick={() => setActiveTab('down')}
                style={{ cursor: 'pointer' }}
              >
                Down
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === 'selected' ? 'active bg-primary text-white' : ''}
                onClick={() => setActiveTab('selected')}
                style={{ cursor: 'pointer' }}
              >
                Selected
              </NavLink>
            </NavItem>
          </Nav>
        </div>
        
        <div>
          {showHints && (
            <Button 
              color="warning" 
              size="sm" 
              onClick={getHint} 
              disabled={!highlightedClue}
            >
              Get Hint ({hintsUsed})
            </Button>
          )}
        </div>
      </div>
      
      <TabContent activeTab={activeTab} className="p-3 bg-light rounded">
        <TabPane tabId="across">
          {allAcrossClues.map((clue) => (
            <div 
              key={`across-${clue.number}`} 
              className={`mb-2 p-2 rounded ${isHighlighted(clue) ? 'bg-info-subtle' : ''}`}
              onClick={() => handleClueClick({...clue, direction: 'across'})}
              style={{ cursor: 'pointer' }}
            >
              <strong>{clue.number}.</strong> {clue.clue} ({clue.answer.length})
            </div>
          ))}
        </TabPane>
        
        <TabPane tabId="down">
          {allDownClues.map((clue) => (
            <div 
              key={`down-${clue.number}`} 
              className={`mb-2 p-2 rounded ${isHighlighted(clue) ? 'bg-info-subtle' : ''}`}
              onClick={() => handleClueClick({...clue, direction: 'down'})}
              style={{ cursor: 'pointer' }}
            >
              <strong>{clue.number}.</strong> {clue.clue} ({clue.answer.length})
            </div>
          ))}
        </TabPane>
        
        <TabPane tabId="selected">
          {acrossClues.length > 0 && (
            <div className="mb-3">
              <h6 className="fw-bold border-bottom pb-1 mb-2">Across</h6>
              {acrossClues.map((clue) => (
                <div 
                  key={`sel-across-${clue.number}`} 
                  className={`mb-2 p-2 rounded ${isHighlighted(clue) ? 'bg-info-subtle' : ''}`}
                  onClick={() => handleClueClick(clue)}
                  style={{ cursor: 'pointer' }}
                >
                  <strong>{clue.number}.</strong> {clue.clue} ({clue.answer.length})
                </div>
              ))}
            </div>
          )}
          
          {downClues.length > 0 && (
            <div>
              <h6 className="fw-bold border-bottom pb-1 mb-2">Down</h6>
              {downClues.map((clue) => (
                <div 
                  key={`sel-down-${clue.number}`} 
                  className={`mb-2 p-2 rounded ${isHighlighted(clue) ? 'bg-info-subtle' : ''}`}
                  onClick={() => handleClueClick(clue)}
                  style={{ cursor: 'pointer' }}
                >
                  <strong>{clue.number}.</strong> {clue.clue} ({clue.answer.length})
                </div>
              ))}
            </div>
          )}
          
          {acrossClues.length === 0 && downClues.length === 0 && (
            <div className="text-center text-muted py-4">
              <p>Select a cell to see relevant clues</p>
            </div>
          )}
        </TabPane>
      </TabContent>
    </div>
  );
}
