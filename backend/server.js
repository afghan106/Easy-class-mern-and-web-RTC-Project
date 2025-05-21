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

const socketUserMapping = {

}; // Map socket.id to user info

io.on('connection',(socket)=>{
  console.log('new user added ',socket.id);

  socket.on(ACTIONS.JOIN,({roomId,user})=>{
     socketUserMapping[socket.id]=user;

     const clients=Array.from(io.sockets.adapter.rooms.get(roomId) || []);

     clients.forEach((client)=>{
      io.to(clientId).emit(ACTIONS.ADD_PEER)
     })

     socket.emit(ACTIONS.ADD_PEER,{});

     socket.join(roomId);
     console.log('all clients :',clients);



  })
})

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
