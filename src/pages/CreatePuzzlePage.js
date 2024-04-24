import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../services/firebaseService';
import { useNavigate } from 'react-router-dom';
import '../styles/puzzles.css'; // Import the CSS file

const CreatePuzzlePage = ({ user }) => {
  const navigate = useNavigate();
  const [riddle, setRiddle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const docRef = await addDoc(collection(db, 'riddles'), {
        author: user.displayName || user.email,
        date: new Date().toISOString(),
        solution: riddle,
        description,
      });

      navigate(`/puzzleSolve/${docRef.id}`);
    } catch (err) {
      console.error('Error adding riddle:', err);
      setError('Failed to create riddle. Please try again later.');
    }
  };

  return (
    <div className="create-puzzle-container">
      <div className="container">
        <h2>Create a Riddle</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
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
      </div>
    </div>
  );
};

export default CreatePuzzlePage;
