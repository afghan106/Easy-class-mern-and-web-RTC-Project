import React from 'react'
import useWebRtc from '../../hooks/useWebRTC'
import styles from './Room.module.css'
import {useParams} from 'react-router-dom';
import {useSelector} from 'react-redux'
import ChatSection from '../chat/Chat';
import VideoStreamingPlayer from '../screenShare/Screen';

const Room = () => {

  const {id:roomId}=useParams();
  const user=useSelector((state)=>state.auth.user);

 const {clients,provideRef}=useWebRtc({roomId,user});

   
  return (<>
  
  <div className={styles.header}>
this is header
</div>
<div className={styles.main}>

<div className={styles.users}>


{
clients.map((client=>{
return <div  className={styles.client} key={client.id}>
  {/* <audio 
  ref={(instance)=>provideRef(instance,client.id)}
  controls autoPlay></audio> */}
 <div className={styles.image}>
 <img className={styles.avatar} src={client.avatar} alt="" />
 
 </div>
 <img  className={styles.mic} src='/images/mic.png' alt="" />
  <p>{client.name}</p>
</div>
}))
}


</div>
<div className={styles.screen}>

  <VideoStreamingPlayer/>
{/* <div className={styles.video}>this screen sharing field</div>
      <div className={styles.buttons}>buttons</div> */}
</div>
      
<div className={styles.chat}><ChatSection/></div>
</div>
  </>
  )
}

export default Room