import { useEffect, useRef, useCallback } from 'react';
import { useStateWithCallback } from './useStateWithCallback';
import {socketInit} from '../socket/index';
import { ACTIONS } from '../actions';


export const useWebRTC = (roomId, user) => {
  const [clients, setClients] = useStateWithCallback([]); // Initialize with the current user
  const audioElements = useRef({});
  // const connections = useRef({});
  const localMediaStream = useRef(null);



  //for socket io
    const socket = useRef(null);

  useEffect(()=>{
    socket.current=socketInit();

  },[])
  


  // Add new client if not already present
  const addNewClient = useCallback(

    (newClient,cb)=>{
      const lookingFor=clients.find(
        (client)=>client.id===newClient.id
      );
      if(lookingFor===undefined){
        setClients(
          (existingClients)=>[...existingClients,newClient],
          cb
        )
      }
    }
    ,[clients,setClients]
);



  // Capture local audio stream and add current user as client
  useEffect(() => {
    const startCapture = async () => {
        localMediaStream.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
      }


                              
                                startCapture().then(()=>{

                                  
                                  addNewClient(user,()=>{
                                    const localElement=audioElements.current[user.id];
                                  
                                  
                                    if (localElement) {
                                      localElement.volume=0;
                                      localElement.srcObject=localMediaStream.current;
                                      
                                    }
                            ///socket emit JOIN using socket-io
                                      socket.current.emit(ACTIONS.JOIN,{roomId,user})





                                  })
                                })
                              }, []);


  // Provide audio element ref for a user
  const provideRef = (instance, userId) => {
    audioElements.current[userId] = instance;
};

  return {
    clients,
    provideRef,
    // handleMute,
  };
};
