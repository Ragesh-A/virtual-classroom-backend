/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config();

const { REACT_IP } = process.env;

const io = require('socket.io')(8800, {
  cors: {
    origin: REACT_IP,
  },
});

let activeUsers = [];
function getOnlineUsersByClass(classId) {
  return activeUsers.filter((user) => user.classId === classId);
}

function getSocketId(userId, classId) {
  return activeUsers.find(
    (user) => user.userId === userId && user.classId === classId,
  );
}

io.on('connection', (socket) => {
  // add new user
  socket.on('new-user-add', (data) => {
    console.log(activeUsers);
    if (
      !activeUsers.some(
        (user) => user.userId === data.user && user.classId === data.class,
      )
    ) {
      activeUsers.push({
        userId: data.user,
        classId: data.class,
        socketId: socket.id,
      });
    }

    // sending to client
    io.emit('get-users', getOnlineUsersByClass(data.class));
  });

  // send message
  socket.on('send-message', ({
    senderId, receiverId, classId, message,
  }) => {
    const user = getSocketId(receiverId, classId);
    io.to(user?.socketId).emit('get-message', {
      senderId,
      message,
    });
  });

  // user is disconnected
  socket.on('disconnect', () => {
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log('disconnected');
    io.emit('user disconnected', activeUsers);
  });
});
