import React, { useState, useEffect } from 'react';
import Riddle from '../components/RiddleComponent';
import Wordle from '../components/WordleComponent';
import Daily from '../components/DailyWordleComponent';
import { useParams } from 'react-router-dom';

const PuzzleSolvePage = (user) => {

  const { type } = useParams();

  return (
    <div>
      {type === 'riddle' ? <Riddle user={user} /> : type === 'wordle' ? <Wordle user={user} /> : <Daily user={user} />} 
    </div>
  );
};

export default PuzzleSolvePage;
