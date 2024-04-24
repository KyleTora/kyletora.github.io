// services/apiService.js

import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';

export const addPostFromAPI = async (postData) => {
  try {
    const docRef = await addDoc(collection(db, 'posts'), {
      content: postData.content,
      timestamp: new Date(postData.timestamp),
      userId: 'api',
      likes: 0,
      comments: [],
      imageURL: postData.imageURL,
      source: 'API',
      tags: postData.tags,
      apiData: {
        league: postData.league,
        matchId: postData.matchId,
        videoURL: postData.videoURL,
      },
    });
    console.log('Post added with ID: ', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding post: ', error);
    throw error;
  }
};
