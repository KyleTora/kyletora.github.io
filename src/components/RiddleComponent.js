import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../services/firebaseService';
import { useNavigate } from 'react-router-dom';
import '../styles/puzzles.css';

const RiddleComponent = ({user}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [riddle, setRiddle] = useState('');
  const [solution, setSolution] = useState('');
  const [error, setError] = useState(null);
  const [isSolved, setIsSolved] = useState(false);
  const [question, setQuestion] = useState('');
  const userID = user.user.uid;

  useEffect(() => {
    const fetchRiddle = async () => {
      try {
        const riddleDoc = await getDoc(doc(db, 'riddles', id));
        if (riddleDoc.exists()) {
          setRiddle(riddleDoc.data().solution);
          setQuestion(riddleDoc.data().description);
        } else {
          setError('Riddle not found');
        }
      } catch (err) {
        console.error('Error fetching riddle:', err);
        setError('Failed to fetch riddle. Please try again later.');
      }
    };

    fetchRiddle();
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (solution.toUpperCase() === riddle.toUpperCase()) {
      setIsSolved(true);
      setError(null);
      handleRiddleComplete();

    } else {
      setError('Incorrect solution. Try again!');
    }
  };

  const handleRiddleComplete = async () => {
    try {
      const userDocRef = doc(db, 'users', userID);
      
      await updateDoc(userDocRef, {
        completedRiddles: arrayUnion(id) 
      });
      
      console.log('Riddle completed successfully');
    } catch (err) {
      setError('Failed to update riddle. Please try again later.');
      console.error('Error completing riddle:', err);
    }
  };

  if (!riddle) {
    return <div>Loading...</div>;
  }

  if (isSolved) {
    return (
      <div className="solve-riddle-container">
        <h2>Congratulations!</h2>
        <p>You've successfully solved the riddle.</p>

      </div>
    );
  }

  return (
    <div className="solve-riddle-container">
      <h2>Solve the Riddle</h2>
      {error && <p className="error">{error}</p>}
      <p className='question'>{question}</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="solution">Solution is {riddle.length} letters long</label>
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

export default RiddleComponent;
