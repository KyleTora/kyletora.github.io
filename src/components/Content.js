import React, { useState, useEffect } from 'react';
import '../styles/components.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import { collection, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebaseService';
import { useNavigate } from 'react-router-dom';

const Content = ({ user, selectedPuzzles, selectedFilter, selectedPageLength }) => {
  const navigate = useNavigate();
  const [puzzles, setPuzzles] = useState([]);

  useEffect(() => {
    const getFilteredPuzzles = async () => {
      if (!selectedPuzzles || selectedPuzzles.length === 0) {
        setPuzzles([]);
        return;
      }

      const promises = selectedPuzzles.map(puzzleType => {
        const puzzleRef = collection(db, puzzleType);
        return getDocs(puzzleRef);
      });

      const results = await Promise.all(promises);
      let fetchedPuzzles = results.flatMap(docList => docList.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // Apply the selected filter
      switch (selectedFilter) {
        case 'Most likes':
          fetchedPuzzles.sort((a, b) => b.likes - a.likes);
          break;
        case 'Most solved':
          // Add your sorting logic for 'Most solved' here
          break;
        case 'Order by date':
          fetchedPuzzles.sort((a, b) => new Date(b.date) - new Date(a.date));
          break;
        case 'Order by difficulty':
          // Add your sorting logic for 'Order by difficulty' here
          break;
        default:
          break;
      }

      // Limit the number of displayed puzzles
      fetchedPuzzles = fetchedPuzzles.slice(0, selectedPageLength);

      setPuzzles(fetchedPuzzles);
    };

    getFilteredPuzzles();
  }, [selectedPuzzles, selectedFilter, selectedPageLength]);

  const handleLike = async (puzzleId) => {
    try {
      const puzzleRef = doc(db, 'riddles', puzzleId);
      const puzzleDoc = await getDoc(puzzleRef);

      if (puzzleDoc.exists()) {
        const currentLikes = puzzleDoc.data().likes || 0;
        await updateDoc(puzzleRef, { likes: currentLikes + 1 });

        setPuzzles(prevPuzzles => {
          return prevPuzzles.map(puzzle => {
            if (puzzle.id === puzzleId) {
              return {
                ...puzzle,
                likes: currentLikes + 1
              };
            }
            return puzzle;
          });
        });
      }
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  const handleSolveClick = (puzzleId) => {
    navigate(`/puzzleSolve/${puzzleId}`);
  };

  return (
    <div className='content'>
      <h1 className="title">Puzzle Feed</h1>
      {puzzles.map((puzzle) => (
        <div key={puzzle.id} className="puzzle-container">
          <h4 className="puzzle-description">{puzzle.description}</h4>
          <div className="puzzle-info">
            <p className="puzzle-author">Posted by: {puzzle.author}</p>
            <p className="puzzle-likes">Likes: {puzzle.likes}</p>
          </div>
          <div className="puzzle-actions">
            <button onClick={() => handleLike(puzzle.id)}>
              <FontAwesomeIcon icon={faThumbsUp} />
            </button>
            <button onClick={() => handleSolveClick(puzzle.id)} className="solve-button">
              <FontAwesomeIcon icon={faPlayCircle} />
              Solve Puzzle
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Content;
