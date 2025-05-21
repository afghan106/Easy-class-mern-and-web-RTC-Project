
import { useStateWithCallback } from './useStateWithCallback';
import {users} from './dumydata';
import { useCallback, useEffect, useRef } from 'react';
import {socketInit} from '../socket/index'
import {ACTIONS} from '../actions.js';

const useWebRtc = ({roomId,user}) => {

    const [clients,setClients]=useStateWithCallback([])

 const audioElements=useRef({});
 const connections=useRef({});
 const localMediaStream=useRef(null  )
const socket=useRef(null)


 useEffect(()=>{
  socket.current=socketInit();
 })
 





const addNewClients = useCallback((newClient, cb) => {
  setClients((existingClients) => {
    const lookingFor = existingClients.find((client) => client.id === newClient.id);
    if (!lookingFor) {
      return [...existingClients, newClient];
    }
    return existingClients;
  }, cb);
}, [setClients]);


 //capture from our computer the nedia
 useEffect(() => {
   const startCapture=async()=>{
  localMediaStream.current= await navigator.mediaDevices.getUserMedia({
      audio:true,
      // video:true
    })
   }
 
   startCapture().then(()=>{

 addNewClients(user, () => {
  const localElement = audioElements.current[user.id];
  if (localElement) {
    localElement.volume = 0;
    localElement.srcObject = localMediaStream.current;
  }
// socket emit JOIN using Socket.io

socket.current.emit(ACTIONS.JOIN,{roomId,user})

});


   })
   return () => {
     
   }
 }, [])
 
  const provideRef=(instance,userId)=>{
  audioElements.current[userId]=instance;

 }

 
  return {
    clients,
    provideRef
  }
}

export default useWebRtc