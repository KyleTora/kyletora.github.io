import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebaseService';
import { useNavigate } from 'react-router-dom';
import '../styles/puzzles.css';

const WordleComponent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [wordle, setWordle] = useState('');
  const [solution, setSolution] = useState('');
  const [error, setError] = useState(null);
  const [isSolved, setIsSolved] = useState(false);
  const [question, setQuestion] = useState('');

  useEffect(() => {
    const fetchWordle = async () => {
      try {
        const wordleDoc = await getDoc(doc(db, 'wordles', id));
        if (wordleDoc.exists()) {
          setWordle(wordleDoc.data().solution);
          setQuestion(wordleDoc.data().description);
        } else {
          setError('Wordle not found');
        }
      } catch (err) {
        console.error('Error fetching wordle:', err);
        setError('Failed to fetch wordle. Please try again later.');
      }
    };

    fetchWordle();
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (solution.toUpperCase() === wordle.toUpperCase()) {
      setIsSolved(true);
      setError(null);
    } else {
      setError('Incorrect solution. Try again!');
    }
  };

  if (!wordle) {
    return <div>Loading...</div>;
  }

  if (isSolved) {
    return (
      <div className="solve-wordle-container">
        <h2>Congratulations!</h2>
        <p>You've successfully solved the wordle.</p>

      </div>
    );
  }

  return (
    <div className="solve-wordle-container">
      <h2>Solve the Wordle</h2>
      {error && <p className="error">{error}</p>}
      <p>{question}</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="solution">Solution: {wordle.length} letters</label>
          <input
            type="text"
            id="solution"
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            required
          />
        </div>
        <button type="submit">Check Solution</button>
      </form>
    </div>
  );
};

export default WordleComponent;
