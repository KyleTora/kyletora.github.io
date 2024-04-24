import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import { auth } from './firebase';
import CreatePuzzle from './pages/CreatePuzzlePage';
import SolvePuzzle from './pages/SolvePuzzlePage';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Router>
      <div className="app">
        <Header isAuthenticated={user !== null} />
        <Routes>
          <Route path="/" element={<HomePage user={user} />} />
          <Route path="/profile" element={<ProfilePage user={user} />} />
          <Route path="/signin" element={user ? <Navigate to="/" /> : <SignInPage />} />
          <Route path="/signup" element={user ? <Navigate to="/" /> : <SignUpPage />} />
          <Route 
            path="/puzzleBuild" 
            element={user ? <CreatePuzzle user={user} /> : <Navigate to="/signin" />} 
          />
          <Route path="/puzzleSolve/:id" element={<SolvePuzzle user={user} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
