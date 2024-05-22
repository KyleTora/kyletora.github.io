import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import '../styles/profilepage.css';

const ProfilePage = ({ user }) => {
  const navigate = useNavigate();
  const [completedRiddles, setCompletedRiddles] = useState([]);
  const [completedWordles, setCompletedWordles] = useState([]);
  const [solvedRiddlesCount, setSolvedRiddlesCount] = useState(0); // Track number of solved riddles
  const [solvedWordlesCount, setSolvedWordlesCount] = useState(0); // Track number of solved wordles

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

          const completedRiddlesData = userData.completedRiddles || [];
          const completedWordlesData = userData.completedWordles || [];

          setSolvedRiddlesCount(completedRiddlesData.length);
          setSolvedWordlesCount(completedWordlesData.length);

          setCompletedRiddles(completedRiddlesData);
          setCompletedWordles(completedWordlesData);

        } else {
          console.error('User document not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [user]);

  return (
<div class="profile-container">
    <div class="profile-sidebar">
        <div class="profile-picture">
            <img src="user-profile-image.jpg" alt="Profile Picture"></img>
        </div>
        <div class="profile-details">
            <strong>Name:</strong> John Doe<br></br>
            <strong>Email:</strong> john@example.com<br></br>
            <strong>Solved Riddles:</strong> 50
        </div>
    </div>
    <div class="profile-feed">
        <p class="bio">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget dolor quam. Aliquam erat volutpat.
        </p>
        <div class="medals">
            <img src="gold-medal.png" alt="Gold Medal"></img>
            <img src="silver-medal.png" alt="Silver Medal"></img>
            <img src="bronze-medal.png" alt="Bronze Medal"></img>
        </div>
        <div class="streak">
            <strong>Current Streak:</strong> 10 days
        </div>
    </div>
</div>
      
  );
};

export default ProfilePage;
