/* eslint-disable no-underscore-dangle */
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit')
const { Server } = require('socket.io');
const { createServer } = require('http');
const connectDB = require('./config/db.config');
const { notFound, errorHandler } = require('./api/middleware/errorHandler');

require('dotenv').config();

const PORT = process.env.PORT || 8000;
const { REACT_IP } = process.env;
const indexRoute = require('./api/routes/index.routes');

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
})

app.use((req, res, next) => {
  res.removeHeader('X-Powered-By')
  next()
})

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './public')));
app.use('/api', limiter)
app.use('/api', indexRoute);
app.use('*', (req, res) => {
  res
    .status(404)
    .json({ error: 'The requested path was not found on the server.' });
});

app.use(notFound);
app.use(errorHandler);

connectDB()
  .then(() => {
    const server = createServer(app);
    server.listen(PORT, () => {
      console.log(`server running on port ${PORT}`);
    });

    const io = new Server(server, {
      pingTimeout: 60000, // no request or response it will close the connection for the bandwidth;
      cors: {
        origin: REACT_IP,
      },
    });

    let onlineUser = [];

    function getOnlineUsersByClass(classId) {
      return onlineUser.filter((user) => user.class === classId);
    }

    io.on('connection', (socket) => {
      socket.on('setup', (userData) => {
        if (userData?._id) {
          socket.join(`${userData?._id}-${userData?.classId}`);
          socket.emit('connected');

          if (
            !onlineUser.some(
              (user) =>
                user.user === userData?._id && user.class === userData?.classId
            )
          ) {
            onlineUser.push({
              user: userData?._id,
              class: userData?.classId,
              socketId: socket.id,
            });
          } else {
            console.log('user is there fuck');
          }
        }
        console.log(onlineUser, 'onlibe');
        io.emit('online-users', getOnlineUsersByClass(userData?.classId))
      });

      socket.on('join-chat', (room) => {
        socket.join(room);
        // console.log(room, 'joined room');
      });

      socket.on('typing', (roomId) => {
        socket.in(roomId).emit('typing', roomId);
      });

      socket.on('stop-typing', (roomId) =>
        socket.in(roomId).emit('stop-typing')
      );

      socket.on('new-message', (newMessageReceived) => {
        const { chat } = newMessageReceived;
        if (chat?.users) {
          chat.users.forEach((user) => {
            if (user._id !== newMessageReceived.sender._id) {
              socket
                .to(`${user?._id}-${chat?.class}`)
                .emit('message-received', newMessageReceived);
            }
          });
        }
      });

      socket.on('disconnect', () => {
        onlineUser = onlineUser.filter((user) => user.socketId !== socket.id);
        console.log('after logout', onlineUser);
        io.emit('online-users', onlineUser)
        socket.rooms.forEach((room) => {
          socket.leave(room);
        });
      });
    });
  })
  .catch((error) => {
    console.error(error);
  });
