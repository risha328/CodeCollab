const File = require('../models/File');
const Project = require('../models/Project');
const jwt = require('jsonwebtoken');

// Get file content for editing
const getFileContent = async (req, res) => {
  try {
    const { fileId } = req.params;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId || decoded.id;
    console.log('User ID from token:', userId);

    // Find file and check permissions
    const file = await File.findById(fileId).populate('projectId');
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Check if user is owner or collaborator
    const project = file.projectId;
    const isOwner = project.owner.toString() === userId;
    const isCollaborator = project.collaborators.some(collab => collab.toString() === userId);

    console.log('Project owner:', project.owner.toString());
    console.log('Project collaborators:', project.collaborators.map(c => c.toString()));
    console.log('Is owner:', isOwner);
    console.log('Is collaborator:', isCollaborator);

    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ message: 'Not authorized to access this file' });
    }

    res.json({
      file: {
        id: file._id,
        name: file.name,
        content: file.content || '',
        language: file.language || 'plaintext'
      }
    });
  } catch (error) {
    console.error('Error fetching file content:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Save file content
const saveFileContent = async (req, res) => {
  try {
    const { fileId } = req.params;
    const { content } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId || decoded.id;

    // Find file and check permissions
    const file = await File.findById(fileId).populate('projectId');
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Check if user is owner or collaborator
    const project = file.projectId;
    const isOwner = project.owner.toString() === userId;
    const isCollaborator = project.collaborators.some(collab => collab.toString() === userId);

    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ message: 'Not authorized to edit this file' });
    }

    // Update file content
    file.content = content;
    await file.save();

    res.json({ message: 'File saved successfully' });
  } catch (error) {
    console.error('Error saving file content:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getFileContent,
  saveFileContent
};
