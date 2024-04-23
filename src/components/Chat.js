import React, { useState } from 'react';
import '../styles/chat.css';

const Chat = ({ postId, messages, onSendMessage }) => {
  const [messageText, setMessageText] = useState('');

  const handleSendMessage = () => {
    if (messageText.trim() !== '') {
      onSendMessage(messageText, postId);
      setMessageText('');
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className="chat-message">
            <p>{message.text}</p>
            <span>{message.sender}</span>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
