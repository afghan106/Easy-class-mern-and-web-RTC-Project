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

DbConnect();

app.use(express.json({ limit: '8mb' }));
app.use(router);

// Sockets
const socketUserMapping = {}; // Fixed typo here (was duplicated with different spellings)

io.on('connection', (socket) => {
  console.log('New connection', socket.id);

  socket.on(ACTIONS.JOIN, ({ roomId, user }) => {
    // Map socket.id to user
    socketUserMapping[socket.id] = user;

    // Get clients already in the room
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);

    // Notify existing clients about the new peer
    clients.forEach(clientId => {
      io.to(clientId).emit(ACTIONS.ADD_PEER, {
        peerId: socket.id,  // The new peer's socket id
        createOffer: false,
        user,
      });

      // Notify the new client about existing peers
      socket.emit(ACTIONS.ADD_PEER, {
        peerId: clientId,
        createOffer: true,
        user: socketUserMapping[clientId],
      });
    });

    // Join the room after notifying peers
    socket.join(roomId);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    // Remove user from mapping
    delete socketUserMapping[socket.id];
    console.log('Disconnected', socket.id);
  });
//handle realay ice whic mean to handle the ice condidate

socket.on(ACTIONS.RELAY_ICE,({peerId,icecondidate})=>{
io.to(peerId).emit(ACTIONS.ICE_CANDIDATE,
  peerId,
  icecondidate
)
})


//handle relay sdp {session description } the information of the use browser
socket.on(ACTIONS.RELAY_ICE,({peerId,sesssionDescription})=>{
  io.to(peerId),emit(ACTIONS.SESSION_DESCRIPTION,{
    peerId,
    sesssionDescription
  })
})

});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
