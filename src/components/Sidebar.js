import React, { useState } from 'react';
import '../styles/sidebar.css';

const Sidebar = ({ onPuzzleSelect }) => {
  const [selectedPuzzles, setSelectedPuzzles] = useState([]);

   const puzzles = ['riddles', 'wordles']; //, 'Crosswords', 'Sudokus', 'Rebus Puzzles'];

  const handlePuzzleChange = (puzzle) => {
    const updatedPuzzles = selectedPuzzles.includes(puzzle)
      ? selectedPuzzles.filter((selectedPuzzle) => selectedPuzzle !== puzzle)
      : [...selectedPuzzles, puzzle];
    
    setSelectedPuzzles(updatedPuzzles);
    onPuzzleSelect(updatedPuzzles);  // Call the onPuzzleSelect function with the updated list of selected puzzles
  };

  return (
    <aside className="sidebar">
      <h2>Puzzle Filter</h2>
      <ul>
        {puzzles.map((puzzle) => (
          <li key={puzzle}>
            <label>
              <input
                type="checkbox"
                value={puzzle}
                checked={selectedPuzzles.includes(puzzle)}
                onChange={() => handlePuzzleChange(puzzle)}
              />
              {puzzle}
            </label>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
