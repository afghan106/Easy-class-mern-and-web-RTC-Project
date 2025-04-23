// TextInput.jsx
import React from 'react';
import styles from './TextInput.module.css'; // Import the CSS module

const TextInput = ({ placeholder }) => {
    return (
        <input className={styles.input} type="text" placeholder={placeholder} />
    );
};

export default TextInput;