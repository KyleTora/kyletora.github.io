import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const ProfilePage = ({ user }) => {
  const navigate = useNavigate();
    console.log(user.providerData);
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

    </div>
  );
};

export default ProfilePage;
