import React, { useState } from 'react';
import { collection, addDoc, updateDoc, doc, arrayUnion } from 'firebase/firestore';
import { db } from '../services/firebaseService';
import { useNavigate } from 'react-router-dom';
import '../styles/puzzles.css'; 

const CreatePuzzlePage = ({ user }) => {
  const navigate = useNavigate();
  const [riddle, setRiddle] = useState('');
  const [wordle, setWordle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const [isRiddle, setIsRiddle] = useState(false);
  const userID = user.uid;

  const handleSwitchClick = () => {
    setIsRiddle(!isRiddle);
  };

  const handleRiddleSubmit = async (e) => {
    e.preventDefault();

    try {
      const docRef = await addDoc(collection(db, 'riddles'), {
        author: user.displayName || user.email,
        date: new Date().toISOString(),
        solution: riddle,
        description,
        puzzleType: "riddle",
        likes: 0
      });

      const userDocRef = doc(db, 'users', userID);
      
      await updateDoc(userDocRef, {
        createdRiddles: arrayUnion(docRef.id),
      });

      navigate(`/puzzleSolve/riddle/${docRef.id}`);
    } catch (err) {
      console.error('Error adding riddle:', err);
      setError('Failed to create riddle. Please try again later.');
    }
  };

  const handleWordleSubmit = async (e) => {
    e.preventDefault();

    try {
      const docRef = await addDoc(collection(db, 'wordles'), {
        author: user.displayName || user.email,
        date: new Date().toISOString(),
        solution: wordle,
        description,
        puzzleType: "wordle",
        likes: 0
      });

      const userDocRef = doc(db, 'users', userID);
      
      await updateDoc(userDocRef, {
        createdWordles: arrayUnion(docRef.id),
      });

      navigate(`/puzzleSolve/wordle/${docRef.id}`);
    } catch (err) {
      console.error('Error adding wordle:', err);
      setError('Failed to create wordle. Please try again later.');
    }
  };

  return (
    <div className="create-puzzle-container">
      <div className="container">
        <h2>Create a Puzzle</h2>
        <div className='switch-container'>
          <a className='switch-label'>Wordle</a>
          <label className="switch">
            <input type="checkbox" checked ={isRiddle} onChange={handleSwitchClick}></input>
            <span className="slider round"></span>
          </label>
          <a className='switch-label'>Riddle</a>
        </div>
        {error && <p className="error">{error}</p>}
        
        {isRiddle ? (
        <form onSubmit={handleRiddleSubmit}>
          <div className="form-group">
              <label htmlFor="description">Riddle:</label>
              <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              ></textarea>
          </div>
          <div className="form-group">
              <label htmlFor="riddle">Answer:</label>
              <textarea
              id="riddle"
              value={riddle}
              onChange={(e) => setRiddle(e.target.value)}
              required
              ></textarea>
          </div>
          <button type="submit">Create Riddle</button>
        </form>
        ) : (
        <form onSubmit={handleWordleSubmit}>
          <div className="form-group">
              <label htmlFor="description">Wordle:</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
          </div>
          <div className="form-group">
              <label htmlFor="wordle">Answer:</label>
              <textarea
                id="wordle"
                value={wordle}
                onChange={(e) => setWordle(e.target.value)}
                required
              ></textarea>
          </div>
          <button type="submit">Create Wordle</button>
        </form>
        )}
      </div>
    </div>
  );
};

export default CreatePuzzlePage;
