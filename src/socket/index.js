/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config();

const { REACT_IP } = process.env;

const io = require('socket.io')(8800, {
  cors: {
    origin: REACT_IP,
  },
});

let activeUser = [];

io.on('connection', (socket) => {
// add new user
  socket.on('new-user-add', (newUserId) => {
    console.log(activeUser);
    if (!activeUser.some((user) => user.userId === newUserId)) {
      activeUser.push({
        userId: newUserId,
        socketId: socket.id,
      });
    }

    // sending to client

    io.emit('get-users', activeUser);
  });

  // user is disconnected
  socket.on('disconnected', () => {
    activeUser = activeUser.filter((user) => user.socketId !== socket.id);

    io.emit('user disconnected', activeUser);
  });
});
