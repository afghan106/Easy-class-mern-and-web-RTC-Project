import React, { useEffect, useState } from 'react'
import Card from '../../../components/shared/Card/Card'
import Button from '../../../components/shared/button/Button'
import styles from "./Avatar.module.css";
import { useHistory } from "react-router-dom";
import Loader from '../../../components/shared/Loader/Loader'
import { useDispatch,useSelector } from 'react-redux';
import {setAvatar} from '../../../store/activateSlice'
import {activate} from '../../../http/index';
import { setAuth } from '../../../store/authSlice';

const Avatar = ({back}) => {
  const dispatch=useDispatch();
  const history=useHistory();
      const { name, avatar } = useSelector((state) => state.activate);
  const [image,setImage]=useState('/images/monkey-avatar.png')
 const [unMounted, setUnMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(){
  history.push('/rooms')
  
          if (!name || !avatar) return;
          setLoading(true);
          try {
              const { data } = await activate({ name, avatar });

              if (data.auth) {
                  if (unMounted) {
                      dispatch(setAuth(data));
                  }
              }
          } catch (err) {
              console.log(err);
          } finally {
              setLoading(false);
          }
 
  }
   
  function captureImage(e){
 const file=e.target.files[0];
    const reader=new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend=()=>{
      setImage(reader.result);
      dispatch(setAvatar(reader.result));
    }
    
  }

      useEffect(() => {
          return () => {
              setUnMounted(true);
          };
      }, []);

      if (loading) return <Loader message="Activation in progress..." />
  return (
    <Card title={`📷 Hey, ${name}!`}>
      <p>here how you look</p>
     <div className={styles.avatarWrapper}>
                         <img
                            
                             className={styles.avatarImage}
                             src={image}
                             alt="avatar"
                             
                         />
                     </div>
       <div>
                          <input
                              onChange={captureImage}
                              id="avatarInput"
                              type="file"
                              className={styles.avatarInput}
                          />
                          <label className={styles.avatarLabel} htmlFor="avatarInput">
                              Choose a different photo
                          </label>
                      </div>
    <Button text={'Submit'} onclick={submit}></Button>
    <p style={{color:"#6799ff"}} className={styles.nameAgain}>set the Name Again !</p>
    </Card>
    
  )
}

export default Avatar