import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../services/firebaseService';
import { useNavigate } from 'react-router-dom';
import '../styles/puzzles.css';

const WordleComponent = ({user}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [wordle, setWordle] = useState('');
  const [solution, setSolution] = useState('');
  const [error, setError] = useState(null);
  const [isSolved, setIsSolved] = useState(false);
  const [question, setQuestion] = useState('');
  const userID = user.user.uid;
  var areLettersCorrect = new Array(5).fill(false);

  useEffect(() => {
    const fetchWordle = async () => {
      try {
        const wordleDoc = await getDoc(doc(db, 'daily', id));
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

    const convertedAnswer = [...solution.toUpperCase()];
    const convertedWordle = [...wordle.toUpperCase()];
    
    if(solution.length === wordle.length)
    {
      for(var i = 0; i < wordle.length; i++)
      {
        if(convertedAnswer[i] === convertedWordle[i])
        {
          areLettersCorrect[i] = true;
        }
      }
    }

    if (solution.toUpperCase() === wordle.toUpperCase()) {
      setError(null);
      handleRiddleComplete();

    } else {
      setError('Incorrect solution. Try again!');
    }
  };


  const handleRiddleComplete = async () => {
    try {
        const userDocRef = doc(db, 'users', userID);
        
        // Check if the user has already completed the puzzle
        const userDoc = await getDoc(userDocRef);
        const completedWordles = userDoc.data().completedWordles || [];
        if (completedWordles.includes(id)) {
            setError('You have already solved this wordle.');
            console.log('You have already solved this wordle.');
            return;
        }

        // Update the solves count for the puzzle
        const puzzleRef = doc(db, 'daily', id); // Replace 'puzzles' with the actual collection name
        const puzzleDoc = await getDoc(puzzleRef);
        if (puzzleDoc.exists()) {
            const currentSolves = puzzleDoc.data().solves || 0;
            await updateDoc(puzzleRef, { solves: currentSolves + 1 });
        }
        
        // Update the completed puzzles field in the user document
        await updateDoc(userDocRef, {
            completedWordles: arrayUnion(id) 
        });

        setIsSolved(true);
        console.log('Riddle completed successfully');
    } catch (err) {
        setError('Failed to update riddle. Please try again later.');
        console.error('Error completing riddle:', err);
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
      <h2>Welcome To The Daily Wordle</h2>
      <p className='subheading'>Come back every day and try to solve each one to keep your streak going!</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="solution" className='question'>{question}</label>
            <input type="text" 
                  id="solution"
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  required 
                  autoFocus 
                  autoComplete='off'
                  maxLength={5} 
                  minLength={5}
            />
            <div className='row letter-row'>
              <div className="letter-box">{solution[0]}</div>
              <div className="letter-box">{solution[1]}</div>
              <div className="letter-box">{solution[2]}</div>
              <div className="letter-box">{solution[3]}</div>
              <div className="letter-box">{solution[4]}</div>
            </div>
          </div>
          <button type="submit">Check Solution</button>
        </form>
        {error && <p className="error">{error}</p>}
    </div>
  );
};

export default WordleComponent;