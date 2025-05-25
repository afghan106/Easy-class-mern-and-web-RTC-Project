import React, { useEffect, useState } from 'react'
import useWebRtc from '../../hooks/useWebRTC'
import styles from './Room.module.css'
import {useParams ,useHistory} from 'react-router-dom';
import {useSelector} from 'react-redux'
import ChatSection from '../chat/Chat';
import VideoStreamingPlayer from '../screenShare/Screen';
import {FaMicrophoneSlash,FaMicrophone } from 'react-icons/fa'
import { getRoom } from '../../http';



const Room = () => {


  const {id:roomId}=useParams();
  const user=useSelector((state)=>state.auth.user);
const history=useHistory();
 const {clients,provideRef}=useWebRtc({roomId,user});
 const [micMuted, setMicMuted]=useState(false);
const [room,setRoom]=useState(null);



 const handleManualLeave=()=>{
  history.push('/rooms')
 }
   
  // Toggle mic mute/unmute (UI only)
  const toggleMic = () => {
    setMicMuted(!micMuted);
  };


  useEffect(()=>{
    const fetchRoom=async()=>{
      const {data }=await getRoom(roomId);
      setRoom((prev)=>data.topic)
    }
    fetchRoom();
  },[roomId])



  return (<>
  
  <div className={styles.header}>
    <div className={styles.button}>
      <button onClick={handleManualLeave} className={styles.goBack}><img src='/images/arrow-left.png'></img><span>back to Rooms</span></button>
    </div >
<div className={styles.topic} >{room}</div>
        <div className={styles.actionBtn}>
              <button className={styles.actions}><img src="/images/palm.png" alt="" /></button>    
              <button onClick={handleManualLeave} className={styles.actions}><img src="/images/win.png" alt="" /><span style={{marginLeft:"15px" }}>leave quietly</span></button> 
              
        </div>
</div>
<div className={styles.main}>

<div className={styles.users}>


{
clients?.map((client=>{
return <div  className={styles.client} key={client?.id}>
  {/* <audio 
  ref={(instance)=>provideRef(instance,client.id)}
  controls autoPlay></audio> */}
 <div className={styles.image}>
 <img className={styles.avatar} src={client?.avatar} alt="" />
 
 </div>
  {/* Mic mute/unmute (UI only) */}
  <button onClick={toggleMic} className={styles.mic} aria-label="Mic Mute/Unmute">
          {micMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
        </button>
  <p>{client?.name}</p>
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