import React, { useState } from 'react';
import Content from '../components/Content';
import Sidebar from '../components/Sidebar';
import { Link, Navigate } from 'react-router-dom';

import '../styles/homepage.css';

const HomePage = ({ user }) => {
  const [selectedPuzzles, setSelectedPuzzles] = useState(['riddles']);
  const [selectedFilter, setSelectedFilter] = useState('Most likes');
  const [selectedPageLength, setSelectedPageLength] = useState(10); // Default page length

  const handlePuzzleSelect = (selectedPuzzles) => {
    setSelectedPuzzles(selectedPuzzles);
  };

  const handleFilterSelect = (selectedFilter) => {
    setSelectedFilter(selectedFilter);
  };

  const handlePageLengthSelect = (selectedPageLength) => {
    setSelectedPageLength(selectedPageLength);
  };

  return (
    <div className="homepage">
      <div className="container row mx-auto">
        <div className="col-3">
          <Sidebar 
            onPuzzleSelect={handlePuzzleSelect} 
            onFilterSelect={handleFilterSelect} 
            onPageLengthSelect={handlePageLengthSelect} 
          />
        </div>
        <div className="col-7">
          {user && user.providerData[0]?.displayName ? (
            <>
              <h4 className='heading'>Welcome back, {user.providerData[0].displayName}!</h4>
            </>
          ) : null}
          <Content 
            selectedPuzzles={selectedPuzzles} 
            selectedFilter={selectedFilter} 
            selectedPageLength={selectedPageLength} 
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
