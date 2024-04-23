import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import { auth } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

function App() {
  const [user, setUser] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

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

  const handleSignInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSignInWithEmail = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setOpenPopup(false);
      setEmail('');
      setPassword('');
    } catch (error) {
      setError(error.message);
    }
  };
  
  const handleSignOut = () => {
    auth.signOut();
  };

  return (
    <Router>
      <div className="app">
        <Header />
        {user ? (
          <HomePage user={user} handleSignOut={handleSignOut} />
        ) : (
          <>
            <button onClick={handleSignInWithGoogle}>Sign In with Google</button>
            <button onClick={() => setOpenPopup(true)}>Sign In with Email</button>
            {openPopup && (
              <div className="popup">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleSignInWithEmail}>Sign In</button>
                {error && <p className="error">{error}</p>}
              </div>
            )}
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
