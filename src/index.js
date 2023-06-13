/* eslint-disable no-underscore-dangle */
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const path = require('path');
const { Server } = require('socket.io');
const { createServer } = require('http');
const connectDB = require('./config/db.config');
const { notFound, errorHandler } = require('./api/middleware/errorHandler');

require('dotenv').config();

const PORT = process.env.PORT || 8000;
const { REACT_IP } = process.env;
const indexRoute = require('./api/routes/indexRoute');

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './public')));
app.use('/api', indexRoute);
app.use('*', (req, res) => {
  res
    .status(404)
    .json({ message: 'The requested path was not found on the server.' });
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

    io.on('connection', (socket) => {
      console.log('connected');

      socket.on('setup', (userData) => {
        if (userData?._id) {
          socket.join(userData?._id);
          socket.emit('connected');
        }
      });

      socket.on('join-chat', (room) => {
        socket.join(room);
        console.log(room, 'joined room');
      });

      socket.on('new-message', (newMessageReceived) => {
        const { chat } = newMessageReceived;
        if (!chat?.users) return console.log('no users');
        chat.users.forEach((user) => {
          if (user._id !== newMessageReceived.sender._id) {
            socket.to(user?._id).emit('message-received', newMessageReceived);
          }
        });
      });
    });
  })
  .catch((error) => {
    console.error(error);
  });
