import React from 'react';
import styles from "./Navigation.module.css";

const Navigation = () => {
  return (
    <div className={styles.nav}>
        <div className={styles.logo}><img src="/images/daimand.png" alt="logo" className={styles.image} /></div>
        <h1>Easy-Class</h1>
        <div className={styles.info}>userinfo</div>
    </div>
  )
}

export default Navigation