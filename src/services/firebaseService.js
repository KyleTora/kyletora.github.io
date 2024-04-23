// services/firebaseService.js

import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { auth } from '../firebase';
import { Timestamp } from 'firebase/firestore';

const db = getFirestore();

// Function to fetch all posts
export const fetchPosts = async () => {
  const posts = [];

  const querySnapshot = await getDocs(collection(db, 'posts'));
  querySnapshot.forEach((doc) => {
    posts.push({ id: doc.id, ...doc.data() });
  });

  return posts;
};


export const addPostFromAPI = async (postData) => {
    const postRef = db.collection('posts').doc();
    const timestamp = Timestamp.fromDate(new Date());
  
    const newPost = {
      ...postData,
      timestamp,
    };
  
    await postRef.set(newPost);
  };

  export { db };  // Export Firestore instance
