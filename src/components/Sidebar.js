import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const items = Array.from({ length: 20 }, (_, index) => `Item ${index + 1}`);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    // Here you can implement logic to load content based on the selected item
  };

  return (
    <aside className="sidebar">
    <h4>Drivers Standings</h4>
      <ol className="list-group">
        {items.map((item, index) => (
          <li key={index} className="list-group-item">
            {item} <FontAwesomeIcon icon={faArrowRight} className='icon' onClick={() => handleItemClick(item)}/> 
          </li>
        ))}
      </ol>
      {selectedItem && (
        <div className="arrow" onClick={() => setSelectedItem(null)}>
          <span>&#8592;</span>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
