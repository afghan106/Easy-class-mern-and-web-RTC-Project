import React from 'react'
import useWebRtc from '../../hooks/useWebRTC'
import styles from './Room.module.css'
import {useParams} from 'react-router-dom';
import {useSelector} from 'react-redux'

const Room = () => {

  const {id:roomId}=useParams();
  const user=useSelector((state)=>state.auth.user);

 const {clients,provideRef}=useWebRtc({roomId,user});

   
  return (
    <div className={styles.main}>


      <h1>all connected clients</h1>

      <div className={styles.users}>
  {
        clients.map((client=>{
          return <div  key={client.id}>
            <audio 
            ref={(instance)=>provideRef(instance,client.id)}
            controls autoPlay></audio>
            <p>{client.name}</p>
          </div>
        }))
      }
    
      </div>
    </div>
  )
}

export default Room