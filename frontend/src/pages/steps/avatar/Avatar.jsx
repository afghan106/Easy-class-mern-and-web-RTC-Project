import React from 'react'
import Card from '../../../components/shared/Card/Card'
import Button from '../../../components/shared/button/Button'
import styles from "./Avatar.module.css";
import { useHistory } from "react-router-dom";
const Avatar = ({back}) => {
  const history=useHistory();

  function submit(){
  history.push('/rooms')
  }
  return (
    <Card title={'📷 Hey, Avatar!'}>
      <p>here how you look</p>
      <div className={styles.image}>
        <img src="/images/monkey-avatar.png" alt="avatar" />
      </div>
    <Button text={'Submit'} onclick={submit}></Button>
    <p style={{color:"#6799ff"}}>set the Name Again !</p>
    </Card>
    
  )
}

export default Avatar