import React from 'react'
import { useWebRTC } from '../../hooks/useWebRTC'
import {useParams} from 'react-router-dom';
import {useSelector} from 'react-redux';


const Room = () => {
  const user=useSelector((state)=>state.auth.user)
  const {id:roomId}=useParams();
const {clients,provideRef}=useWebRTC(roomId,user);


  return (
  <div>

    

    {
      clients.map(client=>{
        return <div key={client.id}>
          <audio
          ref={(instance)=>{provideRef(instance,client.id)}}
          controls 
          autoPlay ></audio>
          <h4>{client.name}</h4>
        </div>
      }
    )
    }
  </div>
  )
}

export default Room;