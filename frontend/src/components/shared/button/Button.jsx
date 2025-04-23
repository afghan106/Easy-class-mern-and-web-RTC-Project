import React from 'react'
import styles from "./Button.module.css";

const Button = ({onclick,text}) => {
  return (
    <button className={styles.button} onClick={onclick}>{text}</button>

  )
}

export default Button