import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import '../styles/signin.css';

import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccess(true);
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      const userRef = doc(db, 'users', result.user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        // If the user document doesn't exist, create it
        await setDoc(userRef, {
          email: result.user.email,
          completedRiddles: [],
          likedRiddles: [],
          createdRiddles: []
        });
      }
      
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="signin-container">
      {success && <Navigate to="/" />}
      <h2>Sign In</h2>
      <form onSubmit={handleSignIn}>
        <div className="form-group">
          <label>Email</label>
          <input
            className='text-boxes'
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            className='text-boxes'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign In</button>
        <button type="button" onClick={handleSignInWithGoogle}>
          Sign In with Google
        </button>
        {error && <p className="error">{error}</p>}
      </form>
      <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
    </div>
  );
};

export default SignInPage;
