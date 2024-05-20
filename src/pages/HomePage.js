import React, { useState } from 'react';
import Content from '../components/Content';
import Sidebar from '../components/Sidebar';
import { Link, Navigate } from 'react-router-dom';

import '../styles/homepage.css';

const HomePage = ({ user }) => {
  const [selectedPuzzles, setSelectedPuzzles] = useState(['riddles']);
  const [selectedFilter, setSelectedFilter] = useState('popular');
  const [selectedPageLength, setSelectedPageLength] = useState(10);

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
        <div className="col-md-5 col-lg-2 col-12">
          {/* <Sidebar 
            onPuzzleSelect={handlePuzzleSelect} 
            onFilterSelect={handleFilterSelect} 
            onPageLengthSelect={handlePageLengthSelect} 
          /> */}
        </div>
        <div className="col-md-12 col-lg-12 col-12">
          <Content user={user}
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
