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
const corsOption = {
    credentials: true,
    origin: [process.env.FRONT_URL],
};
app.use(cors(corsOption));
app.use('/storage', express.static('storage'));

const PORT = process.env.PORT || 5500;
DbConnect();
app.use(express.json({ limit: '8mb' }));
app.use(router);



// Sockets
const socketUserMapping={

}

const socketUserMaping = {};

io.on('connection', (socket) => {
    console.log('New connection', socket.id);
                    socket.on(ACTIONS.JOIN,({roomId,user})=>{
                        socketUserMaping[socket.id]=user;

                        //this is Map 
                        const clients=Array.from(io.sockets.adapter.rooms.get(roomId) || [] );

                        clients.forEach(clientId=>{
                            io.to(clientId).emit(ACTIONS.ADD_PEER,{
                                peerId:clientId,
                                createOffer:false,
                                user
                            })
                        })
                        
                        socket.emit(ACTIONS.ADD_PEER,{
                            peerId:cleintId,
                            createOffer:true,
                            user:socketUserMaping[clientId]
                        });
                        socket.join(roomId);
                        
                        
                    })
    });


server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
