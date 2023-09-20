require('dotenv').config();

const { REACT_IP } = process.env;

const io = require('socket.io')(9090, {
	cors: {
		origin: REACT_IP,
	},
});

// io.on('connection', (connection) => {
// 	connection.on(
// 		'create',
// 		catchError((roomId) => {
// 			const room = getRoom(io, roomId);
// 			if (room) throw new Error('try again');
// 			connection.join(roomId);
// 			connection.emit('created', { success: 'created successfully' });
// 		})
// 	);

// 	connection.on(
// 		'join',
// 		catchError((roomId, user) => {
// 			console.log('joined', roomId);
// 			if (!user || !roomId) throw new Error('invalid data' + roomId + user);
// 			const room = getRoom(io, roomId);
// 			if (!room) throw new Error('No such room');
// 			if (room.size > 0 && room.size < 50) {
// 				connection.join(roomId);
// 				connection.emit('joined');
// 				connection.broadcast.to(roomId).emit('new-joiner', user);
// 			} else {
// 				connection.emit('full');
// 			}
// 		})
// 	);

// 	connection.on(
// 		'ready',
// 		catchError((roomId) => {
// 			if (!roomId) throw new Error('invalid data' + roomId);
// 			const room = getRoom(io, roomId);
// 			if (!room) throw new Error('No such room');
// 			console.log('ready', roomId);
// 			connection.broadcast.to(roomId).emit('ready');
// 		})
// 	);

// 	connection.on(
// 		'candidate',
// 		catchError((candidate, roomId, userId) => {
// 			if (!candidate || !roomId)
// 				throw new Error('invalid data' + roomId + candidate);
// 			const room = getRoom(io, roomId);
// 			if (!room) throw new Error('No such room');
// 			console.log('candiadate', candidate);
// 			connection.broadcast.to(roomId).emit('candidate', candidate, userId);
// 		})
// 	);

// 	connection.on(
// 		'offer',
// 		catchError((offer, roomId) => {
// 			if (!roomId || !offer) throw new Error('Invalid data');
// 			const room = getRoom(io, roomId);
// 			if (!room) throw new Error('No such room');
// 			console.log('offer ');
// 			connection.broadcast.to(roomId).emit('offer', offer);
// 		})
// 	);

// 	connection.on(
// 		'answer',
// 		catchError((answer, roomId) => {
// 			if (!answer || !roomId) throw new Error('Invalid data');
// 			const room = getRoom(io, roomId);
// 			if (!room) throw new Error('No such room');
// 			console.log('answer');
// 			connection.broadcast.to(roomId).emit('answer', answer);
// 		})
// 	);

// 	function catchError(fn) {
// 		return (...args) => {
// 			try {
// 				fn(...args);
// 			} catch (error) {
// 				connection.emit('error', error.message);
// 			}
// 		};
// 	}
// });
// function getRoom(io, roomId) {
// 	const rooms = io.sockets.adapter.rooms;
// 	const room = rooms.get(roomId);
// 	return room;
// }

const participants = {}

io.on('connection', socket => {
	console.log('User connected');

	socket.on('join', () => {
		participants[socket.id] = socket;
		socket.broadcast.emit('joined', socket.id);
	});

	socket.on('candidate', (candidate, targetParticipantId) => {
		participants[targetParticipantId].emit('candidate', candidate. socket.id);
	});

	socket.on('offer', (offer, targetParticipantId) => {
		participants[targetParticipantId].emit('offer',  offer, socket.id,);
	});

	socket.on('answer', (answer, targetParticipantId) => {
		participants[targetParticipantId].emit('answer',  answer, socket.id);
	});

	socket.on('disconnect', () => {
		console.log('User disconnected');
		delete participants[socket.id];
	});
});
