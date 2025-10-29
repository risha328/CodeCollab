const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoute');
const projectRoutes = require('./routes/project');
const fileRoutes = require('./routes/files');
const activityRoutes = require('./routes/activity');
const editorRoutes = require('./routes/editor');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Frontend URL
    methods: ["GET", "POST"]
  }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/projects/:projectId/files', fileRoutes);
app.use('/api/projects/:projectId', activityRoutes);
app.use('/api/editor', editorRoutes);

// Socket.io connection handling with authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.userId || decoded.id;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id, 'User ID:', socket.userId);

  // Join a file room for collaborative editing
  socket.on('join-file', async (data) => {
    const { fileId } = data;
    const userId = socket.userId;

    try {
      // Verify user has access to the file
      const File = require('./models/File');
      const file = await File.findById(fileId).populate('projectId');
      if (!file) {
        socket.emit('error', { message: 'File not found' });
        return;
      }

      const project = file.projectId;
      const isOwner = project.owner.toString() === userId;
      const isCollaborator = project.collaborators.some(collab => collab.toString() === userId);

      if (!isOwner && !isCollaborator) {
        socket.emit('error', { message: 'Not authorized to access this file' });
        return;
      }

      socket.join(`file-${fileId}`);
      console.log(`User ${userId} joined file ${fileId}`);

      // Send current file content to the user
      socket.emit('file-content', {
        fileId,
        content: file.content || '',
        language: file.language || 'plaintext'
      });

      // Notify others in the room
      socket.to(`file-${fileId}`).emit('user-joined', { userId });
    } catch (error) {
      console.error('Error joining file:', error);
      socket.emit('error', { message: 'Failed to join file' });
    }
  });

  // Handle code edits
  socket.on('edit', async (data) => {
    const { fileId, content } = data;
    const userId = socket.userId;

    try {
      // Update file content in database
      const File = require('./models/File');
      await File.findByIdAndUpdate(fileId, { content });

      // Broadcast to other users in the room
      socket.to(`file-${fileId}`).emit('edit', { content, userId });
    } catch (error) {
      console.error('Error updating file:', error);
      socket.emit('error', { message: 'Failed to save changes' });
    }
  });

  // Handle cursor movements
  socket.on('cursor-move', (data) => {
    const { fileId, position } = data;
    const userId = socket.userId;
    socket.to(`file-${fileId}`).emit('cursor-move', { position, userId });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
