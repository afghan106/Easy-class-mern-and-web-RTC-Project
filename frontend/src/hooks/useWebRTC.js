import { useEffect, useRef, useCallback } from 'react';
import { useStateWithCallback } from './useStateWithCallback';

export const useWebRTC = (roomId, user) => {
  const [clients, setClients] = useStateWithCallback([]);
  const audioElements = useRef({});
  const connections = useRef({});
  const socket = useRef(null);
  const localMediaStream = useRef(null);

  // Provide audio element ref for a user
  const provideRef = (instance, userId) => {
    audioElements.current[userId] = instance;
  };

  // Add new client if not already present
  const addNewClient = useCallback(
    (newClient, cb) => {
      const lookingFor = clients.find(client => client.id === newClient.id);

      if (!lookingFor) {
        setClients(existingClients => [...existingClients, newClient], cb);
      } else if (cb) {
        cb();
      }
    },
    [clients, setClients]
  );

  // Capture local audio stream and add current user as client
  useEffect(() => {
    const startCapture = async () => {
      try {
        localMediaStream.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        addNewClient(user, () => {
          const localElement = audioElements.current[user.id];
          if (localElement) {
            localElement.volume = 0;
            localElement.srcObject = localMediaStream.current;
          }
        });
      } catch (err) {
        console.error('Error accessing media devices.', err);
      }
    };

    startCapture();
  }, [addNewClient, user]);

  return {
    clients,
    provideRef,
    // handleMute,
  };
};
