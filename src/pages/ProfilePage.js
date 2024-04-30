import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import '../styles/profilepage.css';

const ProfilePage = ({ user }) => {
  const navigate = useNavigate();
  const [completedRiddles, setCompletedRiddles] = useState([]);
  const [likedRiddles, setLikedRiddles] = useState([]);
  const [createdRiddles, setCreatedRiddles] = useState([]);

  const [displayMode, setDisplayMode] = useState('riddles');
  const [expandedGroups, setExpandedGroups] = useState({ completed: false, liked: false, created: false });

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();

          let completedData, likedData, createdData;

          // Determine which data to fetch based on display mode
          if (displayMode === 'riddles') {
            completedData = userData.completedRiddles || [];
            likedData = userData.likedRiddles || [];
            createdData = userData.createdRiddles || [];
          } else if (displayMode === 'wordles') {
            completedData = userData.completedWordles || [];
            likedData = userData.likedWordles || [];
            createdData = userData.createdWordles || [];
          }

          const [completedRiddleData, likedRiddleData, createdRiddleData] = await Promise.all([
            fetchPuzzleData(completedData),
            fetchPuzzleData(likedData),
            fetchPuzzleData(createdData)
          ]);

          setCompletedRiddles(completedRiddleData);
          setLikedRiddles(likedRiddleData);
          setCreatedRiddles(createdRiddleData);

        } else {
          console.error('User document not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [user, displayMode]);

  const fetchPuzzleData = async (puzzleIds) => {
    return Promise.all(
      puzzleIds.map(async (puzzleId) => {
        try {
          const puzzleDoc = await getDoc(doc(db, displayMode === 'riddles' ? 'riddles' : 'wordles', puzzleId));
          return { id: puzzleId, ...puzzleDoc.data() };
        } catch (error) {
          console.error('Error fetching puzzle data:', error);
          return null;
        }
      })
    );
  };

  const handleSolveClick = (puzzle) => {
    navigate(`/puzzleSolve/${puzzle.puzzleType}/${puzzle.id}`);
  };

  const toggleGroup = (group) => {
    setExpandedGroups({ ...expandedGroups, [group]: !expandedGroups[group] });
  };

  return (
    <div className="profile-container">
      <div className='container row mx-auto'>
        <div className='col-3 profile-sidebar'>
          {user && user.photoURL && (
            <div className="profile-picture">
              <img src={user.photoURL} alt="Profile" />
            </div>
          )}

          {user && user.providerData[0]?.displayName && (
            <div>
              <strong>Name:</strong> {user.providerData[0].displayName}
            </div>
          )}
          {user && user?.email && (
            <div>
              <strong>Email:</strong> {user.email}
            </div>
          )}
        </div>

        <div className="col-7 profile-feed">
          <div className='profile-header'>
            <button className={displayMode === 'riddles' ? 'selected' : ''} onClick={() => setDisplayMode('riddles')}>Riddles</button>
            <button className={displayMode === 'wordles' ? 'selected' : ''} onClick={() => setDisplayMode('wordles')}>Wordles</button>
          </div>

          {displayMode === 'riddles' && (
            <>
              <div className='completed-riddles'>
                <h2 onClick={() => toggleGroup('completed')}>Completed Riddles</h2>
                {expandedGroups.completed && completedRiddles.map((puzzle) => (
                  <div key={puzzle.id} className="puzzle-container">
                    <a className='puzzle-type'>{puzzle.puzzleType}</a>
                    <h4 className="puzzle-description">{puzzle.description}</h4>
                    <div className="puzzle-info">
                      <p className="puzzle-author">Posted by: {puzzle.author}</p>
                    </div>
                    <div className="puzzle-actions">
                      <button onClick={() => handleSolveClick(puzzle)} className="solve-button">
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className='created-riddles'>
                <h2 onClick={() => toggleGroup('created')}>Created Riddles</h2>
                {expandedGroups.created && createdRiddles.map((puzzle) => (
                  <div key={puzzle.id} className="puzzle-container">
                    <a className='puzzle-type'>{puzzle.puzzleType}</a>
                    <h4 className="puzzle-description">{puzzle.description}</h4>
                    <div className="puzzle-info">
                      <p className="puzzle-author">Posted by: {puzzle.author}</p>
                    </div>
                    <div className="puzzle-actions">
                      <button onClick={() => handleSolveClick(puzzle)} className="solve-button">
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className='liked-riddles'>
                <h2 onClick={() => toggleGroup('liked')}>Liked Riddles</h2>
                {expandedGroups.liked && likedRiddles.map((puzzle) => (
                  <div key={puzzle.id} className="puzzle-container">
                    <a className='puzzle-type'>{puzzle.puzzleType}</a>
                    <h4 className="puzzle-description">{puzzle.description}</h4>
                    <div className="puzzle-info">
                      <p className="puzzle-author">Posted by: {puzzle.author}</p>
                    </div>
                    <div className="puzzle-actions">
                      <button onClick={() => handleSolveClick(puzzle)} className="solve-button">
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {displayMode === 'wordles' && (
            <>
              <div className='completed-wordles'>
                <h2 onClick={() => toggleGroup('completed')}>Completed Wordles</h2>
                {expandedGroups.completed && completedRiddles.map((puzzle) => (
                  <div key={puzzle.id} className="puzzle-container">
                    <a className='puzzle-type'>{puzzle.puzzleType}</a>
                    <h4 className="puzzle-description">{puzzle.description}</h4>
                    <div className="puzzle-info">
                      <p className="puzzle-author">Posted by: {puzzle.author}</p>
                    </div>
                    <div className="puzzle-actions">
                      <button onClick={() => handleSolveClick(puzzle)} className="solve-button">
                        View
                      </button>
                    </div>                  
                  </div>
                ))}
              </div>

              <div className='created-wordles'>
                <h2 onClick={() => toggleGroup('created')}>Created Wordles</h2>
                {expandedGroups.created && createdRiddles.map((puzzle) => (
                  <div key={puzzle.id} className="puzzle-container">
                    <a className='puzzle-type'>{puzzle.puzzleType}</a>
                    <h4 className="puzzle-description">{puzzle.description}</h4>
                    <div className="puzzle-info">
                      <p className="puzzle-author">Posted by: {puzzle.author}</p>
                    </div>
                    <div className="puzzle-actions">
                      <button onClick={() => handleSolveClick(puzzle)} className="solve-button">
                        View
                      </button>
                    </div>                  
                  </div>
                ))}
              </div>

              <div className='liked-wordles'>
                <h2 onClick={() => toggleGroup('liked')}>Liked Wordles</h2>
                {expandedGroups.liked && likedRiddles.map((puzzle) => (
                  <div key={puzzle.id} className="puzzle-container">
                    <a className='puzzle-type'>{puzzle.puzzleType}</a>
                    <h4 className="puzzle-description">{puzzle.description}</h4>
                    <div className="puzzle-info">
                      <p className="puzzle-author">Posted by: {puzzle.author}</p>
                    </div>
                    <div className="puzzle-actions">
                      <button onClick={() => handleSolveClick(puzzle)} className="solve-button">
                        View
                      </button>
                    </div>                 
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};


export default ProfilePage;
