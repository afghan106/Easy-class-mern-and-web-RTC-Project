import React from 'react';
import styles from './ChatSection.module.css';
import { FaPaperPlane } from 'react-icons/fa';


const ChatSection = () => {
  return (
    <div className={styles.chatSection}>
      <header className={styles.header}>
        <h2>Chat</h2>
      </header>
      <div className={styles.messages}>
        {/* Messages will be displayed here */}
      </div>
      <form className={styles.inputForm} onSubmit={(e) => e.preventDefault()}>
        <div className={styles.inputWrapper}>
          <input
            autoComplete='false'
            type="text"
            placeholder="Type a message..."
            className={styles.input}
          />
          <button type="submit" className={styles.sendButton} aria-label="Send message">
            <FaPaperPlane></FaPaperPlane>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatSection;
