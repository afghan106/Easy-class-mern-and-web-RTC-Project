import React from 'react'
import styles from './Home.module.css'
import Button from '../../components/shared/button/Button';
import {useHistory} from 'react-router-dom'

const Home = () => {
const history=useHistory();


function onclick(){
  history.push('/authenticate')
}
  return (
    <>
    
      <div className={styles.hero}>
        <h1 className={styles.h1}>Welcome to Easy-Class</h1>
        <p className={styles.p}>Your journey starts here.</p>
        <Button onclick={onclick} text={'Get Started'}/>
    </div>
    
    </>
);
}

export default Home