require('dotenv').config();

const { REACT_IP } = process.env;

const io = require('socket.io')(9090, {
  cors: {
    origin: REACT_IP,
  },
});

const rooms = {};

const getOffer = (userId) => rooms[userId];


io.on('connection', (connection) => {
  console.log(connection.id);

  connection.on('login', (data) => {
    if (!data.user) return;
    rooms[data?.user] = {
      userId: data?.user,
      socketId: connection.id,
    };
    console.log(rooms);
  });

  connection.on('create-new-room', (data) => {
    try {
      if (!data?.offer) return;
      rooms[data?.user?.emailOrPhone].offer = data?.offer;
      rooms[data?.user?.emailOrPhone].username = data?.user?.name;
      console.log(rooms);
    } catch (error) {
      console.log(error);
    }
  });

  connection.on('join-room', ({ user, roomId }) => {
    if (!rooms[roomId]) return;
    io.to(rooms[user?.emailOrPhone]).emit({ offer: rooms[roomId].offer });
  });

  connection.on('disconnect', () => {
    console.log('disconnected');
    io.emit(connection.id);
  });
});
