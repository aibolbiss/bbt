import { Server } from 'socket.io';

const io = new Server({
  cors: {
    origin: 'http://localhost:5173',
  },
});

let onlineUsers = [];

const addUser = (userId, socketId) => {
  const userExits = onlineUsers.find((user) => user.userId === userId);
  if (!userExits) {
    onlineUsers.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUsers.find((user) => user.userId === userId);
};

io.on('connection', (socket) => {
  socket.on('newUser', (userId) => {
    addUser(userId, socket.id);
  });

  socket.on('sendMessage', ({ receiverId, data }) => {
    const receiver = getUser(receiverId);
    if (receiver && receiver.socketId) {
      io.to(receiver.socketId).emit('getMessage', data);
    } else {
      console.log(`User with userId ${receiverId} is not online!`);
    }
  });

  socket.on('disconnect', () => {
    removeUser(socket.id);
  });
});

const PORT = 4001;

io.listen(PORT, () => {
  console.log(`Socket.IO server is running on port ${PORT}`);
});
