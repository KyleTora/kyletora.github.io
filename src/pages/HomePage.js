import React, { useState } from 'react';
import Content from '../components/Content';
import Sidebar from '../components/Sidebar';

import '../styles/homepage.css';

const HomePage = ({ user, handleSignOut }) => {

  return (
    <div className="homepage">
      <div className="container row mx-auto">
        <div className="col-3">
          <Sidebar/>
        </div>
        <div className="col-7">
          <p>Welcome, {user.email}!</p>
          <button onClick={handleSignOut}>Sign Out</button>
          <Content />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
