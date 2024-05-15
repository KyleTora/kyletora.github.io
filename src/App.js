import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage';
import ProfilePage from './pages/ProfilePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import { auth } from './firebase';
import CreatePuzzle from './pages/CreatePuzzlePage';
import SolvePuzzle from './pages/SolvePuzzlePage';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (loading) {
    return <div></div>;
  }

  return (
    <Router>
      <div className="app">
        <Header isAuthenticated={user !== null} />
        <Routes>
          <Route path="/" element={<LandingPage user={user}/>} />
          <Route path="/explore" element={<HomePage user={user} />} />
          <Route path="/profile" element={<ProfilePage user={user} />} />
          <Route path="/signin" element={user ? <Navigate to="/explore" /> : <SignInPage />} />
          <Route path="/signup" element={user ? <Navigate to="/explore" /> : <SignUpPage />} />
          <Route 
            path="/puzzleBuild" 
            element={user ? <CreatePuzzle user={user} /> : <Navigate to="/signin" />} 
          />
          <Route path="/puzzleSolve/:type/:id" element={<SolvePuzzle user={user} />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
