import { useEffect, useRef, useCallback } from 'react';
import { useStateWithCallback } from './useStateWithCallback';
import { socketInit } from '../socket/index';
import { ACTIONS } from '../actions';

export const useWebRTC = (roomId, user) => {
  const [clients, setClients] = useStateWithCallback([]);
  const audioElements = useRef({});
  const localMediaStream = useRef(null);
  const socket = useRef(null);

  const connections=useRef({});

  // Initialize socket connection
  useEffect(() => {
    socket.current = socketInit();

    // Listen for other clients joining
    socket.current.on(ACTIONS.ADD_PEER, ({ peerId, user: newUser }) => {
      // Don't add yourself again
      if (newUser.id === user.id) return;

      addNewClient(newUser);
    });

    // Listen for clients leaving
    socket.current.on(ACTIONS.REMOVE_PEER, ({ peerId, userId }) => {
      setClients((list) => list.filter(client => client.id !== userId));
      delete audioElements.current[userId];
    });

    return () => {
      socket.current.off(ACTIONS.ADD_PEER);
      socket.current.off(ACTIONS.REMOVE_PEER);
    };
  }, [user.id]);

  // Add new client if not already present
  const addNewClient = useCallback(
    (newClient, cb) => {
      setClients((existingClients) => {
        if (existingClients.find(client => client.id === newClient.id)) {
          return existingClients;
        }
        return [...existingClients, newClient];
      }, cb);
    },
    [setClients]
  );

  // Capture local audio stream and add current user as client
  useEffect(() => {
    const startCapture = async () => {
      try {
        localMediaStream.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        // Add local user once
        addNewClient(user, () => {
          const localElement = audioElements.current[user.id];
          if (localElement) {
            localElement.volume = 0;
            localElement.srcObject = localMediaStream.current;
          }

          // Emit JOIN event to server after local user is added
          socket.current.emit(ACTIONS.JOIN, { roomId, user });
        });
      } catch (error) {
        console.error('Error accessing microphone', error);
      }
    };

    startCapture();
  }, [addNewClient, roomId, user]);


useEffect(()=>{
  const handleNewPeer=({peerId,createOffer,user:remoteUser})=>{
//if already connected then give waring
    if(peerId in connections.current){
     return console.warn(`you are already connected with ${peerId} (${user.name})`)
    }
    }
  }
  socket.current.on(ACTIONS.ADD_PEER,handleNewPeer)
})




  // Provide audio element ref for a user
  const provideRef = useCallback((instance, userId) => {
    audioElements.current[userId] = instance;
  }, []);

  return {
    clients,
    provideRef,
  };
};
