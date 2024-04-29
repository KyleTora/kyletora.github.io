import React, { useState, useEffect } from 'react';
import '../styles/components.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import { collection, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebaseService';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; // Assuming '../firebase' is the correct path to your Firebase configuration file

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

  const handleLike = async (puzzleType, puzzleId) => {
    try {
      if (!auth.currentUser) {
        // User is not signed in, notify them to sign in
        alert('Please sign in to like this post.');
        return;
      }

      const puzzleRef = doc(db, `${puzzleType}` + 's', puzzleId);
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

  const handleSolveClick = (puzzle) => {
    navigate(`/puzzleSolve/${puzzle.puzzleType}/${puzzle.id}`);
  };

  return (
    <div className='content'>
      <h1 className="title">Puzzle Feed</h1>
      {puzzles.map((puzzle) => (
        <div key={puzzle.id} className="puzzle-container">
          <a className='puzzle-type'>{puzzle.puzzleType}</a>
          <h4 className="puzzle-description">{puzzle.description}</h4>
          <div className="puzzle-info">
            <p className="puzzle-author">Posted by: {puzzle.author}</p>
          </div>
          <div className="puzzle-actions">
            <button onClick={() => handleLike(puzzle.puzzleType, puzzle.id)} className="like-button">
              <FontAwesomeIcon icon={faThumbsUp} /> {puzzle.likes}
            </button>
            <button onClick={() => handleSolveClick(puzzle)} className="solve-button">
              <FontAwesomeIcon icon={faPlayCircle} /> Solve
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Content;
