import React, { useState, useEffect } from 'react';
import Riddle from '../components/RiddleComponent';
import Wordle from '../components/WordleComponent';
import { useParams } from 'react-router-dom';

const PuzzleSolvePage = () => {

  const { type } = useParams();

  return (
    <div>
      {type === 'wordle' ? <Wordle /> : <Riddle />}
    </div>
  );
};

export default PuzzleSolvePage;
