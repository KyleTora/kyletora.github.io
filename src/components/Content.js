import React, { useState, useEffect } from 'react';
import '../styles/components.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faComments, faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import Chat from './Chat';
import { collection, getDocs, updateDoc, doc, getDoc, arrayUnion, where, query } from 'firebase/firestore';
import { db } from '../services/firebaseService';
import { useNavigate } from 'react-router-dom';

const Content = ({ user, selectedPuzzles }) => {
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
      const fetchedPuzzles = results.flatMap(docList => docList.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      setPuzzles(fetchedPuzzles);
    };

    getFilteredPuzzles();
  }, [selectedPuzzles]);

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

  const [activeChat, setActiveChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);

  const openChat = async (puzzleId) => {
    try {
      const chatRef = doc(db, 'chats', puzzleId);
      const chatDoc = await getDoc(chatRef);

      if (chatDoc.exists()) {
        setChatMessages(chatDoc.data().messages || []);
        setActiveChat(activeChat === puzzleId ? null : puzzleId);
      } else {
        setActiveChat(activeChat === puzzleId ? null : puzzleId);
      }
    } catch (error) {
      console.error('Error opening chat:', error);
    }
  };

  const sendMessage = async (messageText, puzzleId) => {
    try {
      const chatRef = doc(db, 'chats', puzzleId);
      const newMessage = {
        text: messageText,
        sender: user.displayName || 'currentUser',
        timestamp: new Date().toISOString(),
      };

      await updateDoc(chatRef, {
        messages: arrayUnion(newMessage),
      });

      setChatMessages(prevMessages => [...prevMessages, newMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
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
            <button onClick={() => openChat(puzzle.id)}>
              <FontAwesomeIcon icon={faComments} />
            </button>
            <button onClick={() => handleSolveClick(puzzle.id)} className="solve-button">
              <FontAwesomeIcon icon={faPlayCircle} />
              Solve Puzzle
            </button>
          </div>
          {activeChat === puzzle.id && (
            <Chat
              puzzleId={puzzle.id}
              messages={chatMessages}
              onSendMessage={sendMessage}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Content;
