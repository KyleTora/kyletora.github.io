import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';

const ProfilePage = ({ user }) => {
  const navigate = useNavigate();
  const [completedRiddles, setCompletedRiddles] = useState([]);
  const [likedRiddles, setLikedRiddles] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Assuming 'completedRiddles' and 'likedRiddles' are arrays stored in the user's document
        const userDoc = await db.collection('users').doc(user.uid).get();
        const userData = userDoc.data();
        setCompletedRiddles(userData.completedRiddles || []);
        setLikedRiddles(userData.likedRiddles || []);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [user.uid]);

  const handleSignOut = () => {
    auth.signOut();
    navigate('/');
  };

  return (
    <div className="profile-container container">
      <h2>Profile</h2>
      
      {user.photoURL && (
        <div className="profile-picture">
          <img src={user.photoURL} alt="Profile" />
        </div>
      )}

      {user.providerData[0]?.displayName && (
        <div>
          <strong>Name:</strong> {user.providerData[0].displayName}
        </div>
      )}

      <div>
        <strong>Email:</strong> {user.email}
      </div>

      <div>
        <h3>Completed Riddles:</h3>
        <ul>
          {completedRiddles.map((riddle, index) => (
            <li key={index}>{riddle}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Liked Riddles:</h3>
        <ul>
          {likedRiddles.map((riddle, index) => (
            <li key={index}>{riddle}</li>
          ))}
        </ul>
      </div>

      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};

export default ProfilePage;
