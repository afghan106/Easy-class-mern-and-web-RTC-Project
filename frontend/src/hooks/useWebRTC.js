import { useEffect, useRef, useCallback } from 'react';
import { useStateWithCallback } from './useStateWithCallback';
import { socketInit } from '../socket/index';
import { ACTIONS } from '../actions';
import freeice from 'freeice';

export const useWebRTC = (roomId, user) => {
  const [clients, setClients] = useStateWithCallback([]);
  const audioElements = useRef({});
  const localMediaStream = useRef(null);
  const socket = useRef(null);
  const connections = useRef({});

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

  // Initialize socket connection and listeners
  useEffect(() => {
    socket.current = socketInit();

    // Listen for other clients joining
    socket.current.on(ACTIONS.ADD_PEER, ({ peerId, user: newUser, createOffer }) => {
      // Don't add yourself again
      if (newUser.id === user.id) return;

      addNewClient(newUser);
    });

    // Listen for clients leaving
    socket.current.on(ACTIONS.REMOVE_PEER, ({ peerId, userId }) => {
      setClients((list) => list.filter(client => client.id !== userId));
      delete audioElements.current[userId];
      // Clean up connection if exists
      if (connections.current[peerId]) {
        connections.current[peerId].close();
        delete connections.current[peerId];
      }
    });

    return () => {
      socket.current.off(ACTIONS.ADD_PEER);
      socket.current.off(ACTIONS.REMOVE_PEER);
      // Close all connections on cleanup
      Object.values(connections.current).forEach(connection => connection.close());
      connections.current = {};
      // Stop local media stream tracks
      if (localMediaStream.current) {
        localMediaStream.current.getTracks().forEach(track => track.stop());
      }
      socket.current.disconnect();
    };
  }, [user.id, addNewClient, setClients]);

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

    // Cleanup on unmount: stop media tracks
    return () => {
      if (localMediaStream.current) {
        localMediaStream.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [addNewClient, roomId, user]);

  // Handle new peer connections
  useEffect(() => {
    if (!socket.current) return;

    const handleNewPeer = async ({ peerId, createOffer, user: remoteUser }) => {
      if (peerId in connections.current) {
        return console.warn(`You are already connected with ${peerId} (${remoteUser.name})`);
      }

      // Create new RTCPeerConnection with ICE servers
      const connection = new RTCPeerConnection({
        iceServers: freeice(),
      });
      connections.current[peerId] = connection;

      // Handle ICE candidates by sending them to the signaling server
      connection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.current.emit(ACTIONS.RELAY_ICE, {
            peerId,
            icecandidate: event.candidate,
          });
        }
      };

      // Handle remote track event and assign stream to audio element
      connection.ontrack = ({ streams: [remoteStream] }) => {
        addNewClient(remoteUser, () => {
          const audioElement = audioElements.current[remoteUser.id];
          if (audioElement) {
            audioElement.srcObject = remoteStream;
          } else {
            // If audio element is not yet available, retry after some delay
            let settled = false;
            const interval = setInterval(() => {
              const audioEl = audioElements.current[remoteUser.id];
              if (audioEl) {
                audioEl.srcObject = remoteStream;
                settled = true;
              }
              if (settled) {
                clearInterval(interval);
              }
            }, 1000);
          }
        });
      };

      // Add all local tracks to the connection
      if (localMediaStream.current) {
        localMediaStream.current.getTracks().forEach((track) => {
          connection.addTrack(track, localMediaStream.current);
        });
      }

      // If this client should create an offer, do so and send it
      if (createOffer) {
        try {
          const offer = await connection.createOffer();
          await connection.setLocalDescription(offer);
          socket.current.emit(ACTIONS.RELAY_SDP, {
            peerId,
            sessionDescription: offer,
          });
        } catch (err) {
          console.error('Error creating offer:', err);
        }
      }
    };

    socket.current.on(ACTIONS.ADD_PEER, handleNewPeer);

    return () => {
      socket.current.off(ACTIONS.ADD_PEER, handleNewPeer);
    };
  }, [addNewClient]);

  // Handle incoming ICE candidates
  useEffect(() => {
    const handleIceCandidate = ({ peerId, icecandidate }) => {
      if (icecandidate && connections.current[peerId]) {
        connections.current[peerId].addIceCandidate(new RTCIceCandidate(icecandidate)).catch(e => {
          console.error('Error adding received ice candidate', e);
        });
      }
    };

    socket.current.on(ACTIONS.ICE_CANDIDATE, handleIceCandidate);

    return () => {
      socket.current.off(ACTIONS.ICE_CANDIDATE, handleIceCandidate);
    };
  }, []);

  // Handle incoming Session Description Protocol (SDP) messages
  useEffect(() => {
    const handleRemoteSdp = async ({ peerId, sessionDescription: remoteSessionDescription }) => {
      const connection = connections.current[peerId];
      if (!connection) {
        console.warn(`No connection found for peer ${peerId}`);
        return;
      }

      try {
        await connection.setRemoteDescription(new RTCSessionDescription(remoteSessionDescription));

        if (remoteSessionDescription.type === 'offer') {
          const answer = await connection.createAnswer();
          await connection.setLocalDescription(answer);
          socket.current.emit(ACTIONS.RELAY_SDP, {
            peerId,
            sessionDescription: answer,
          });
        }
      } catch (err) {
        console.error('Error handling remote SDP:', err);
      }
    };

    socket.current.on(ACTIONS.SESSION_DESCRIPTION, handleRemoteSdp);

    return () => {
      socket.current.off(ACTIONS.SESSION_DESCRIPTION, handleRemoteSdp);
    };
  }, []);

  // Handle peer removal to prevent room leakage
  useEffect(() => {
    const handleRemovePeer = ({ peerId, userId }) => {
      if (connections.current[peerId]) {
        connections.current[peerId].close();
        delete connections.current[peerId];
      }
      delete audioElements.current[userId];

      setClients((list) => list.filter((client) => client.id !== userId));
    };

    socket.current.on(ACTIONS.REMOVE_PEER, handleRemovePeer);

    return () => {
      socket.current.off(ACTIONS.REMOVE_PEER, handleRemovePeer);
    };
  }, []);

  // Provide audio element ref for a user
  const provideRef = useCallback((instance, userId) => {
    audioElements.current[userId] = instance;
  }, []);

  return {
    clients,
    provideRef,
  };
};
