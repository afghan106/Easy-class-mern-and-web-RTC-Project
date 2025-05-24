require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const DbConnect = require('./database');
const router = require('./routes');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const ACTIONS = require('./actions');

const io = require('socket.io')(server, {
  cors: {
    origin: process.env.FRONT_URL,
    methods: ['GET', 'POST'],
  },
});

app.use(cookieParser());

const corsOptions = {
  credentials: true,
  origin: [process.env.FRONT_URL],
};
app.use(cors(corsOptions));

app.use('/storage', express.static('storage'));

const PORT = process.env.PORT || 5500;

// Connect to the database
DbConnect();

// Middleware to parse JSON bodies with size limit
app.use(express.json({ limit: '8mb' }));

// Use your routes
app.use(router);

// Map to track socket.id to user info
const socketUserMapping = new Map();

io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  socket.on(ACTIONS.JOIN, ({ roomId, user }) => {
    // Save user info for this socket
    socketUserMapping.set(socket.id, user);

    // Get current clients in the room
    const clients = io.sockets.adapter.rooms.get(roomId) || new Set();

    // Notify existing clients about the new peer
    clients.forEach((clientId) => {
      io.to(clientId).emit(ACTIONS.ADD_PEER, {
        peerId: socket.id,
        createOffer: false,
        user,
      });
      // Notify the new client about existing peers
      socket.emit(ACTIONS.ADD_PEER, {
        peerId: clientId,
        createOffer: true,
        user: socketUserMapping.get(clientId),
      });
    });

    // Join the room after notifying peers
    socket.join(roomId);

    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  // Relay ICE candidates to the target peer
  socket.on(ACTIONS.RELAY_ICE, ({ peerId, icecandidate }) => {
    io.to(peerId).emit(ACTIONS.ICE_CANDIDATE, {
      peerId: socket.id,
      icecandidate,
    });
  });

  // Relay SDP (session description) to the target peer
  socket.on(ACTIONS.RELAY_SDP, ({ peerId, sessionDescription }) => {
    io.to(peerId).emit(ACTIONS.SESSION_DESCRIPTION, {
      peerId: socket.id,
      sessionDescription,
    });
  });

  // Function to handle leaving all rooms
  const leaveRoom = () => {
    const rooms = socket.rooms;

    // Note: socket.rooms is a Set including socket.id itself
    rooms.forEach((roomId) => {
      if (roomId === socket.id) return; // skip personal room

      const clients = io.sockets.adapter.rooms.get(roomId) || new Set();

      clients.forEach((clientId) => {
        io.to(clientId).emit(ACTIONS.REMOVE_PEER, {
          peerId: socket.id,
          userId: socketUserMapping.get(socket.id)?.id,
        });
        socket.emit(ACTIONS.REMOVE_PEER, {
          peerId: clientId,
          userId: socketUserMapping.get(clientId)?.id,
        });
      });

      socket.leave(roomId);
      console.log(`User ${socket.id} left room ${roomId}`);
    });

    // Remove user from mapping
    socketUserMapping.delete(socket.id);
  };

  socket.on(ACTIONS.LEAVE, leaveRoom);

  // Clean up on disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    leaveRoom();
  });
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
