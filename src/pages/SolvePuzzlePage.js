import React, { useState, useEffect } from 'react';
import Riddle from '../components/RiddleComponent';
import Wordle from '../components/WordleComponent';
import { useParams } from 'react-router-dom';

const PuzzleSolvePage = (user) => {

  const { type } = useParams();

  return (
    <div>
      {type === 'wordle' ? <Wordle user={user} /> : <Riddle user={user}/>}
    </div>
  );
};

export default PuzzleSolvePage;
