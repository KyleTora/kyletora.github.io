import React, { useState, useEffect } from 'react';
import '../styles/components.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faThumbsUp, faComments } from '@fortawesome/free-solid-svg-icons';
import Chat from './Chat';
import { fetchPosts, db } from '../services/firebaseService';
import { Timestamp, collection, getDocs, updateDoc,getDoc, doc, arrayUnion } from 'firebase/firestore';

const Content = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      const fetchedPosts = await fetchPosts();
      setPosts(fetchedPosts);
    };

    getPosts();
  }, []);

  const formatDate = (timestamp) => {
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate().toLocaleString();
    }
    
    return timestamp;
  };

  const handleLike = async (postId) => {
    try {
      const postRef = collection(db, 'posts');
      const postDoc = await getDocs(postRef);
  
      postDoc.forEach(async (doc) => {
        if (doc.id === postId) {
          const currentLikes = doc.data().likes || 0;
          await updateDoc(doc.ref, { likes: currentLikes + 1 });
          console.log(`Liked post with ID: ${postId}`);
          
          setPosts(prevPosts => {
            return prevPosts.map(post => {
              if (post.id === postId) {
                return {
                  ...post,
                  likes: currentLikes + 1
                };
              }
              return post;
            });
          });
        }
      });
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };
  
  const [activeChat, setActiveChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);

  const openChat = async (postId) => {
    try {
      const chatRef = doc(db, 'chats', postId);
      const chatDoc = await getDoc(chatRef);

      if (chatDoc.exists()) {
        setChatMessages(chatDoc.data().messages || []);
        setActiveChat(activeChat === postId ? null : postId);
      } else {
        setActiveChat(activeChat === postId ? null : postId);
      }
    } catch (error) {
      console.error('Error opening chat:', error);
    }
  };

  const sendMessage = async (messageText, postId) => {
    try {
      const chatRef = doc(db, 'chats', postId);
      const newMessage = {
        text: messageText,
        sender: 'currentUser', // Replace with actual user ID
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

  return (
    <div className='content'>
      <h1>Sports Feed</h1>
      {posts.map((post) => (
        <div key={post.id} className="post">
          <h2>{post.content}</h2>
          <p>{formatDate(post.timestamp)}</p>
          <p>League: {post.apiData.league}</p>
          <p>Source: {post.source}</p>
          <p>Tags: {post.tags.join(', ')}</p>
          <p>Likes: {post.likes}</p>

          {post.videoURL && (
            <video controls>
              <source src={post.videoURL} type="video/mp4" />
            </video>
          )}

          <button onClick={() => handleLike(post.id)}>
            <FontAwesomeIcon icon={faThumbsUp} />
          </button>

          <button onClick={() => openChat(post.id)}>
            <FontAwesomeIcon icon={faComments} />
          </button>
          {activeChat === post.id && (
            <Chat
              postId={post.id}
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
