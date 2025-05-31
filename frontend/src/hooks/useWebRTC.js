import { useStateWithCallback } from './useStateWithCallback';
import { useCallback, useEffect, useRef } from 'react';
import { socketInit } from '../socket/index';
import { ACTIONS } from '../actions.js';
import freeIce from 'freeice';

const useWebRtc = ({ roomId, user }) => {
  const [clients, setClients] = useStateWithCallback([]);

  const audioElements = useRef({});
  const connections = useRef({});
  const localMediaStream = useRef(null);
  const socket = useRef(null);

  // Initialize socket once
  useEffect(() => {
    socket.current = socketInit();
  }, []);

  // Add new client helper with callback
  const addNewClient = useCallback(
    (newClient, cb) => {
      setClients((existingClients) => {
        const lookingFor = existingClients.find((client) => client.id === newClient.id);
        if (!lookingFor) {
          return [...existingClients, newClient];
        }
        return existingClients;
      }, cb);
    },
    [setClients]
  );

  // Capture local media and join room
  useEffect(() => {
    const startCapture = async () => {
      try {
        localMediaStream.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
          
        });
      } catch (error) {
        console.error('Error accessing media devices.', error);
      }
    };

    startCapture().then(() => {
      addNewClient({...user,muted:true}, () => {
        const localElement = audioElements.current[user.id];
        if (localElement) {
          localElement.volume = 0;
          localElement.srcObject = localMediaStream.current;
        }
        // Emit JOIN event to socket server
        socket.current.emit(ACTIONS.JOIN, { roomId, user });
      });
    });

    return () => {
      // Stop all local media tracks on cleanup
      if (localMediaStream.current) {
        localMediaStream.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [roomId, user, addNewClient]);

  // Handle new peer connection
  useEffect(() => {
    const handleNewPeer = async ({ peerId, createOffer, user: remoteUser }) => {
      if (connections.current[peerId]) {
        console.warn(`Already connected to peer ${peerId}, user: ${user.name}`);
        return;
      }

      connections.current[peerId] = new RTCPeerConnection({
        iceServers: freeIce(),
      });

      // Handle ICE candidates
      connections.current[peerId].onicecandidate = (event) => {
        if (event.candidate) {
          socket.current.emit(ACTIONS.RELAY_ICE, {
            peerId,
            icecandidate: event.candidate,
          });
        }
      };

      // Handle remote track event
      connections.current[peerId].ontrack = ({ streams: [remoteStream] }) => {
        addNewClient({...remoteUser,muted:true}, () => {
          const audioElement = audioElements.current[remoteUser.id];
          if (audioElement) {
            audioElement.srcObject = remoteStream;
          } else {
            // Wait for audio element to be available
            let settled = false;
            const interval = setInterval(() => {
              const el = audioElements.current[remoteUser.id];
              if (el) {
                el.srcObject = remoteStream;
                settled = true;
              }
              if (settled) {
                clearInterval(interval);
              }
            }, 1000);
          }
        });
      };

      // Add local tracks to peer connection
      if (localMediaStream.current) {
        localMediaStream.current.getTracks().forEach((track) => {
          connections.current[peerId].addTrack(track, localMediaStream.current);
        });
      }

      // Create offer if needed
      if (createOffer) {
        try {
          const offer = await connections.current[peerId].createOffer();
          await connections.current[peerId].setLocalDescription(offer);

          socket.current.emit(ACTIONS.RELAY_SDP, {
            peerId,
            sessionDescription: offer, // Fixed key name here
          });
        } catch (error) {
          console.error('Error creating offer:', error);
        }
      }
    };

    socket.current.on(ACTIONS.ADD_PEER, handleNewPeer);

    return () => {
      socket.current.off(ACTIONS.ADD_PEER, handleNewPeer);
    };
  }, [addNewClient, user]);

  // Handle ICE candidates from peers
  useEffect(() => {
    const handleIceCandidate = ({ peerId, icecandidate }) => {
      if (icecandidate && connections.current[peerId]) {
        connections.current[peerId].addIceCandidate(icecandidate).catch((e) => {
          console.error('Error adding received ice candidate', e);
        });
      }
    };

    socket.current.on(ACTIONS.ICE_CANDIDATE, handleIceCandidate);

    return () => {
      socket.current.off(ACTIONS.ICE_CANDIDATE, handleIceCandidate);
    };
  }, []);

  // Handle session descriptions from peers
  useEffect(() => {
    const handleRemoteSdp = async ({ peerId, sessionDescription: remoteSessionDescription }) => {
      if (!connections.current[peerId]) {
        console.warn(`No connection found for peer ${peerId}`);
        return;
      }

      try {
        await connections.current[peerId].setRemoteDescription(
          new RTCSessionDescription(remoteSessionDescription)
        );

        if (remoteSessionDescription.type === 'offer') {
          const answer = await connections.current[peerId].createAnswer();
          await connections.current[peerId].setLocalDescription(answer);

          socket.current.emit(ACTIONS.RELAY_SDP, {
            peerId,
            sessionDescription: answer,
          });
        }
      } catch (error) {
        console.error('Error handling remote SDP:', error);
      }
    };

    socket.current.on(ACTIONS.SESSION_DESCRIPTION, handleRemoteSdp);

    return () => {
      socket.current.off(ACTIONS.SESSION_DESCRIPTION, handleRemoteSdp);
    };
  }, []);

  // Handle removing peers
  useEffect(() => {
    const handleRemovePeer = ({ peerId, userId }) => {
      if (connections.current[peerId]) {
        connections.current[peerId].close();
        delete connections.current[peerId];
      }

      if (audioElements.current[peerId]) {
        delete audioElements.current[peerId];
      }

      setClients((list) => list.filter((client) => client.id !== userId));
    };

    socket.current.on(ACTIONS.REMOVE_PEER, handleRemovePeer);

    return () => {
      socket.current.off(ACTIONS.REMOVE_PEER, handleRemovePeer);
    };
  }, []);

  //

  // Provide ref callback for audio elements
  const provideRef = (instance, userId) => {
    audioElements.current[userId] = instance;
  };



  //handle the mute button   

  const handleMute=(isMute,userId)=>{
console.log('mute',isMute);

let settled=false;
let interval=setInterval(() => {
  if (localMediaStream.current) {
  localMediaStream.current.getTracks()[0].enabled=!isMute;
  
  if (isMute) {
    socket.current.emit(ACTIONS.MUTE,{
     roomId,
     userId:userId
    })
    
  }else{
      socket.current.emit(ACTIONS.UNMUTE,{
        roomId,
        userId
      })
    };

    settled=true
}

if (settled) {
  clearInterval(interval)
}
}, 200);

  }







  return {
    clients,
    provideRef,
    handleMute
  };
};

export default useWebRtc;
