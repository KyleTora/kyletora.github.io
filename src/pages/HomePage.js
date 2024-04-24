import React, { useState } from 'react';
import Content from '../components/Content';
import Sidebar from '../components/Sidebar';
import { Link, Navigate } from 'react-router-dom';

import '../styles/homepage.css';

const HomePage = ({ user }) => {
  const [selectedPuzzles, setSelectedPuzzles] = useState([]);

  const handlePuzzleSelect = (selectedPuzzles) => {
    setSelectedPuzzles(selectedPuzzles);
  };

  return (
    <div className="homepage">
      <div className="container row mx-auto">
        <div className="col-3">
          <Sidebar onPuzzleSelect={handlePuzzleSelect} />
        </div>
        <div className="col-7">
          {user && user.providerData[0]?.displayName ? (
            <>
              <h4 className='heading'>Welcome back, {user.providerData[0].displayName}!</h4>
            </>
          ) : null}
          <Content selectedPuzzles={selectedPuzzles} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
