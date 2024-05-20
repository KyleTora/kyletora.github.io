import React, { useState, useEffect } from 'react';
import '../styles/components.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faPlayCircle, faShareAlt, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { collection, getDocs, updateDoc, doc, getDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../services/firebaseService';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; 
import { Modal, Button } from 'react-bootstrap';

const Content = ({ user, selectedPuzzles, selectedFilter, selectedPageLength }) => {
  const navigate = useNavigate();
  const [puzzles, setPuzzles] = useState([]);
  const [dailyPuzzle, setDailyPuzzle] = useState([]);
  const [selectedPuzzle, setSelectedPuzzle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [categoryPuzzles, setCategoryPuzzles] = useState(["View all", "wordles", "riddles", "popular", "newest"]);
  const [showCategories, setShowCategories] = useState(true); // New state variable
  const [selectedCategory, setSelectedCategory] = useState("");

  const userID = user?.uid || '';

  const getDailyPuzzle = async () => {
    try {
      const dailyRef = collection(db, 'daily');
      const querySnapshot = await getDocs(dailyRef);
      if (!querySnapshot.empty) {
        const dailyPuzzles = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        dailyPuzzles.sort((a, b) => b.date.toDate() - a.date.toDate());
        setDailyPuzzle(dailyPuzzles[0]);
      } else {
        console.log('No daily puzzle found.');
      }
    } catch (error) {
      console.error('Error fetching daily puzzle:', error);
    }
  };

  const getCategories = async () => {
    const category = ["wordles", "riddles"];

    const promises = category.map(puzzleType => {
      const puzzleRef = collection(db, puzzleType);
      return getDocs(puzzleRef);
    });
    
    const results = await Promise.all(promises);
    let fetchedPuzzles = results.flatMap(docList => docList.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    
    let all = { title: "All Puzzles", puzzles: fetchedPuzzles };
    let mostLiked = { title: "Popular", puzzles: fetchedPuzzles.sort((a, b) => b.likes - a.likes) };
    let mostSolved = { title: "Easiest", puzzles: fetchedPuzzles.sort((a, b) => b.solves - a.solves) };
    let leastSolved = { title: "Hardest", puzzles: fetchedPuzzles.sort((a, b) => a.solves - b.solves) };
    let newest = { title: "Newest", puzzles: fetchedPuzzles.sort((a, b) => new Date(b.date) - new Date(a.date)) };
    let riddles = { title: "Riddles", puzzles: fetchedPuzzles.filter(a => a.puzzleType === "riddle") };
    let wordles = { title: "Wordles", puzzles: fetchedPuzzles.filter(a => a.puzzleType === "wordle") };
  
    setCategoryPuzzles({
      all,
      wordles,
      riddles,
      mostLiked,
      leastSolved,
      mostSolved,
      newest
    });
    
    console.log(categoryPuzzles);

  };

  const getFilteredPuzzles = async () => {
    if (!selectedPuzzles || selectedPuzzles.length === 0) {
      setPuzzles([]);
      return;
    }

    selectedPuzzles = ["riddles", "wordles"];

    const promises = selectedPuzzles.map(puzzleType => {
      const puzzleRef = collection(db, puzzleType);
      return getDocs(puzzleRef);
    });

    const results = await Promise.all(promises);
    let fetchedPuzzles = results.flatMap(docList => docList.docs.map(doc => ({ id: doc.id, ...doc.data() })));


    fetchedPuzzles.sort((a, b) => new Date(b.date) - new Date(a.date));
  

    fetchedPuzzles = fetchedPuzzles.slice(0, selectedPageLength);

    setPuzzles(fetchedPuzzles);
  };

  useEffect(() => {
    getDailyPuzzle();
    getFilteredPuzzles();
    getCategories();
  }, [selectedPuzzles, selectedFilter, selectedPageLength]);

  const handleCategoryClick = (category) => {
    setPuzzles(category.puzzles); // Set puzzles when category is clicked
    setShowCategories(false); // Hide categories when category is clicked
    setSelectedCategory(category.title);
  };

  const handleBackButtonClick = () => {
    setShowCategories(true); // Show categories again
    setSelectedCategory(""); // Clear selected category
  };

  const handleLike = async (puzzleType, puzzleId) => {
    try {
      if (!auth.currentUser) {
        alert('Please sign in to like this post.');
        return;
      }

      var puzzleRef = doc(db, `${puzzleType}` + 's', puzzleId);

      if(puzzleType == "daily")
      {
        puzzleRef = doc(db, `${puzzleType}`, puzzleId);
      }

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
      
        const userDocRef = doc(db, 'users', userID);
        if(puzzleType === 'riddles')
        {
          await updateDoc(userDocRef, {
            likedRiddles: arrayUnion(puzzleId),
          });
        }
        else if(puzzleType === "wordles")
        {
          await updateDoc(userDocRef, {
            likedWordles: arrayUnion(puzzleId),
          });
        }
      }
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  const handleSolveClick = (puzzle) => {
    if (!auth.currentUser) {
      alert('Please sign in to like this post.');
      return;
    }

    navigate(`/puzzleSolve/${puzzle.puzzleType}/${puzzle.id}`);
  };


  const handleShare = (puzzle) => {
    setSelectedPuzzle(puzzle);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShareOption = (option) => {
    if (option === 'email') {
      const puzzleId = selectedPuzzle?.id;
      if (!puzzleId) {
        console.error('No puzzle ID found');
        return;
      }
      const puzzleURL = `https://kyletora.github.io/puzzleSolve/${selectedPuzzle?.puzzleType}/${puzzleId}`;
      const subject = encodeURIComponent(`Check out this puzzle: ${selectedPuzzle?.description}`);
      const body = encodeURIComponent(`I found this interesting puzzle on PuzzleHub. Check it out: <a href="${puzzleURL}">Puzzle</a>`);
      window.location.href = `mailto:?subject=${subject}&body=${body}&content-type=text/html`;
    } else {
      console.log('Sharing via', option);
    }
    handleCloseModal();
  };
  
  return (
    <div className='content row'>
      <div className='category col-8'>
        {showCategories ? (
          <>
            <h1 className='title'>Categories</h1>
            <div className='blocks row'>
              {Object.entries(categoryPuzzles).map(([key, { title, puzzles }], index) => (
                <div key={index} className='col-4'>
                  <div className='block card' onClick={() => handleCategoryClick({ title, puzzles })}>
                  </div>
                  <div className='category-title'>
                    {title}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
        <div>
          {puzzles.length > 0 && (
            <>
            <div className="selected-category">
              <button onClick={handleBackButtonClick} className="btn btn-secondary back-button">
                <FontAwesomeIcon icon={faArrowLeft} /> Back to Categories
              </button>
              <h1 className='title'>{selectedCategory}</h1>
              <div className="puzzles">
                {puzzles.map((puzzle) => (
                <div key={puzzle.id} className="puzzle-container">
                <a className='puzzle-type'>{puzzle.puzzleType}</a>          
                <span className='puzzle-date'>
                  {new Date(puzzle.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <h4 className="puzzle-description">{puzzle.description}</h4>
                <div className="puzzle-info">
                  <p className="puzzle-author">Posted by: {puzzle.author}</p>
                </div>
                <div className="puzzle-actions">
                  <button onClick={() => handleLike(puzzle.puzzleType, puzzle.id)} className="like-button">
                    <FontAwesomeIcon icon={faThumbsUp} /> Like 
                  </button>
                  <button onClick={() => handleSolveClick(puzzle)} className="solve-button">
                    <FontAwesomeIcon icon={faPlayCircle} /> Solve
                  </button>
                  <button onClick={() => handleShare(puzzle)} className="share-button">
                    <FontAwesomeIcon icon={faShareAlt} /> Share
                  </button>
                </div>
              </div>
            ))}
              </div>
            </div>
            </>
          )}
        </div>
        
        )}
      </div>

      <div className='daily-wordle col-4 order-2'>
        <h1 className="title">Daily Wordle</h1>
         <div key={dailyPuzzle.id} className="puzzle-container">
          <a className='puzzle-type'>{dailyPuzzle.puzzleType}</a>          
          <span className='puzzle-date'>
            {new Date(dailyPuzzle.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          <h4 className="puzzle-description">{dailyPuzzle.description}</h4>
          <div className="puzzle-info">
            <p className="puzzle-author">Todays solves: {dailyPuzzle.solves}</p>
          </div>
          <div className="puzzle-actions">
            <button onClick={() => handleLike(dailyPuzzle.puzzleType, dailyPuzzle.id)} className="like-button">
              <FontAwesomeIcon icon={faThumbsUp} /> Like
            </button>
            <button onClick={() => handleSolveClick(dailyPuzzle)} className="solve-button">
              <FontAwesomeIcon icon={faPlayCircle} /> Solve
            </button>
          </div>
        </div>
        {/* <h1 className="title">All Puzzles</h1>
        {puzzles.map((puzzle) => (
          <div key={puzzle.id} className="puzzle-container">
            <a className='puzzle-type'>{puzzle.puzzleType}</a>          
            <span className='puzzle-date'>
              {new Date(puzzle.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <h4 className="puzzle-description">{puzzle.description}</h4>
            <div className="puzzle-info">
              <p className="puzzle-author">Posted by: {puzzle.author}</p>
            </div>
            <div className="puzzle-actions">
              <button onClick={() => handleLike(puzzle.puzzleType, puzzle.id)} className="like-button">
                <FontAwesomeIcon icon={faThumbsUp} /> Like 
              </button>
              <button onClick={() => handleSolveClick(puzzle)} className="solve-button">
                <FontAwesomeIcon icon={faPlayCircle} /> Solve
              </button>
              <button onClick={() => handleShare(puzzle)} className="share-button">
                <FontAwesomeIcon icon={faShareAlt} /> Share
              </button>
            </div>
          </div>
        ))} */}
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Share Puzzle</Modal.Title>
        </Modal.Header>
        <Modal.Body className='test'>
          <p>Would you like to share the puzzle: <strong>"{selectedPuzzle?.description}"</strong> with others?</p>
          <Button onClick={() => handleShareOption('social-media')}>Share on Social Media</Button>
          <Button onClick={() => handleShareOption('email')}>Share via Email</Button>
          {/* Add more share options as needed */}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Content;
