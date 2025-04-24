// TextInput.jsx
import React from 'react';
import styles from './TextInput.module.css'; // Import the CSS module

const TextInput = ({ placeholder,value,onChange }) => {
    return (
        <input className={styles.input} type="text" placeholder={placeholder} value={value} onChange={onChange} />
    );
};

export default TextInput;