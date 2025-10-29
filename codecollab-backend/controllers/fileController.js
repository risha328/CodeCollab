const File = require('../models/File');
const Project = require('../models/Project');
const Activity = require('../models/Activity');
const Version = require('../models/Version');

// Helper function to recursively delete files and folders
const deleteNestedFiles = async (fileId) => {
  const file = await File.findById(fileId);
  if (!file) return;

  if (file.type === 'folder') {
    const children = await File.find({ parentId: fileId });
    for (const child of children) {
      await deleteNestedFiles(child._id);
    }
  }
  await File.findByIdAndDelete(fileId);
};

const createFile = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, type, content, parentId } = req.body;

    // Check if project exists and user owns it
    const project = await Project.findOne({ _id: projectId, owner: req.user.userId });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // If parentId provided, check if it exists and is a folder
    if (parentId) {
      const parent = await File.findOne({ _id: parentId, projectId, type: 'folder' });
      if (!parent) {
        return res.status(400).json({ message: 'Invalid parent folder' });
      }
    }

    const file = new File({
      name,
      type,
      content: type === 'file' ? content : '',
      parentId: parentId || null,
      projectId
    });

    await file.save();

    // Create initial version for files
    if (type === 'file') {
      try {
        const version = new Version({
          projectId,
          fileId: file._id,
          versionNumber: 1,
          content: content || '',
          changes: 'Initial file creation',
          createdBy: req.user.userId
        });
        await version.save();
      } catch (error) {
        console.error('Failed to create initial version:', error);
      }
    }

    // Log activity
    try {
      const activity = new Activity({
        projectId,
        userId: req.user.userId,
        action: type === 'folder' ? 'folder_created' : 'file_created',
        details: {
          fileId: file._id,
          fileName: name,
          fileType: type,
          parentId
        }
      });
      await activity.save();
    } catch (error) {
      console.error('Failed to log file creation activity:', error);
    }

    res.status(201).json({
      message: 'File/Folder created successfully',
      file
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getFiles = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Check if project exists and user has access (owner or collaborator)
    const project = await Project.findOne({
      _id: projectId,
      $or: [
        { owner: req.user.userId },
        { collaborators: req.user.userId }
      ]
    });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const files = await File.find({ projectId });
    res.json({ files });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getFile = async (req, res) => {
  try {
    const { projectId, fileId } = req.params;

    // Check if project exists and user has access (owner or collaborator)
    const project = await Project.findOne({
      _id: projectId,
      $or: [
        { owner: req.user.userId },
        { collaborators: req.user.userId }
      ]
    });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const file = await File.findOne({ _id: fileId, projectId });
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.json({ file });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getFileContent = async (req, res) => {
  try {
    const { projectId, fileId } = req.params;

    // Check if project exists and user has access (owner or collaborator)
    const project = await Project.findOne({
      _id: projectId,
      $or: [
        { owner: req.user.userId },
        { collaborators: req.user.userId }
      ]
    });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const file = await File.findOne({ _id: fileId, projectId });
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    if (file.type !== 'file') {
      return res.status(400).json({ message: 'Cannot get content of a folder' });
    }

    res.json({ content: file.content });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateFileContent = async (req, res) => {
  try {
    const { projectId, fileId } = req.params;
    const { content } = req.body;

    // Check if project exists and user owns it
    const project = await Project.findOne({ _id: projectId, owner: req.user.userId });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const file = await File.findOne({ _id: fileId, projectId });
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    if (file.type !== 'file') {
      return res.status(400).json({ message: 'Cannot update content of a folder' });
    }

    // Create version before updating
    const versionNumber = await Version.countDocuments({ fileId }) + 1;
    const version = new Version({
      projectId,
      fileId,
      versionNumber,
      content: file.content,
      changes: 'Auto-saved before update',
      createdBy: req.user.userId
    });
    await version.save();

    file.content = content;
    await file.save();

    // Log activity
    try {
      const activity = new Activity({
        projectId,
        userId: req.user.userId,
        action: 'file_updated',
        details: {
          fileId: file._id,
          fileName: file.name,
          versionNumber
        }
      });
      await activity.save();
    } catch (error) {
      console.error('Failed to log file update activity:', error);
    }

    res.json({ message: 'File content updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const renameFile = async (req, res) => {
  try {
    const { projectId, fileId } = req.params;
    const { name } = req.body;

    // Check if project exists and user owns it
    const project = await Project.findOne({ _id: projectId, owner: req.user.userId });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const file = await File.findOne({ _id: fileId, projectId });
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    file.name = name;
    await file.save();

    res.json({
      message: 'File/Folder renamed successfully',
      file
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateFile = async (req, res) => {
  try {
    const { projectId, fileId } = req.params;
    const { name, content } = req.body;

    // Check if project exists and user owns it
    const project = await Project.findOne({ _id: projectId, owner: req.user.userId });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const file = await File.findOne({ _id: fileId, projectId });
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Update fields
    if (name) file.name = name;
    if (content !== undefined && file.type === 'file') file.content = content;

    await file.save();
    res.json({
      message: 'File/Folder updated successfully',
      file
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteFile = async (req, res) => {
  try {
    const { projectId, fileId } = req.params;

    // Check if project exists and user owns it
    const project = await Project.findOne({ _id: projectId, owner: req.user.userId });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const file = await File.findOne({ _id: fileId, projectId });
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Log activity before deletion
    try {
      const activity = new Activity({
        projectId,
        userId: req.user.userId,
        action: file.type === 'folder' ? 'folder_deleted' : 'file_deleted',
        details: {
          fileId: file._id,
          fileName: file.name,
          fileType: file.type
        }
      });
      await activity.save();
    } catch (error) {
      console.error('Failed to log file deletion activity:', error);
    }

    // Delete recursively if folder
    await deleteNestedFiles(fileId);

    res.json({ message: 'File/Folder deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createFile,
  getFiles,
  getFile,
  getFileContent,
  updateFileContent,
  renameFile,
  updateFile,
  deleteFile
};
