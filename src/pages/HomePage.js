import React, { useState } from 'react';
import Content from '../components/Content';
import Sidebar from '../components/Sidebar';


const HomePage = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [teamDetails, setTeamDetails] = useState(null);

  return (
    <div className="homepage">
      <Sidebar selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
      <Content selectedItem={selectedItem} teamDetails={teamDetails} />
    
    </div>
  );
};

export default HomePage;
