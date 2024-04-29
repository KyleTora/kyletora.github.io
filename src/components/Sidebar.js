import React, { useState } from 'react';
import '../styles/sidebar.css';

const Sidebar = ({ onPuzzleSelect, onFilterSelect, onPageLengthSelect }) => {
  const [selectedPuzzles, setSelectedPuzzles] = useState(['riddles']);
  const [selectedFilter, setSelectedFilter] = useState('Most likes');
  const [selectedPageLength, setSelectedPageLength] = useState(5); // Default page length

  const puzzles = ['riddles', 'wordles'];
  const filters = ['Most likes', 'Most solved', 'Order by date', 'Order by difficulty'];
  const pageLengthOptions = [5, 10, 20];

  const handlePuzzleChange = (puzzle) => {
    const updatedPuzzles = selectedPuzzles.includes(puzzle)
      ? selectedPuzzles.filter((selectedPuzzle) => selectedPuzzle !== puzzle)
      : [...selectedPuzzles, puzzle];
    
    setSelectedPuzzles(updatedPuzzles);
    onPuzzleSelect(updatedPuzzles);
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    onFilterSelect(filter);
  };

  const handlePageLengthChange = (length) => {
    setSelectedPageLength(length);
    onPageLengthSelect(length);
  };

  return (
    <aside className="sidebar">
      <h2>Puzzle Filter</h2>
      <ul className="list-unstyled">
        {puzzles.map((puzzle) => (
          <li key={puzzle}>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id={puzzle}
                value={puzzle}
                checked={selectedPuzzles.includes(puzzle)}
                onChange={() => handlePuzzleChange(puzzle)}
              />
              <label className="form-check-label puzzle-label" htmlFor={puzzle}>
                {puzzle}
              </label>
            </div>
          </li>
        ))}
      </ul>
      <h2>Filter By</h2>
      <ul className="list-unstyled">
        {filters.map((filter) => (
          <li key={filter}>
            <div className="form-check">
              <input
                type="radio"
                className="form-check-input"
                id={filter}
                value={filter}
                checked={selectedFilter === filter}
                onChange={() => handleFilterChange(filter)}
              />
              <label className="form-check-label puzzle-label" htmlFor={filter}>
                {filter}
              </label>
            </div>
          </li>
        ))}
      </ul>
      <h2>Page Length</h2>
      <select onChange={(e) => handlePageLengthChange(Number(e.target.value))}>
        {pageLengthOptions.map((option) => (
          <option key={option} value={option} selected={selectedPageLength === option}>
            {option}
          </option>
        ))}
      </select>
    </aside>
  );
};

export default Sidebar;
