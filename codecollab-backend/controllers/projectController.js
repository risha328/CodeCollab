const Project = require('../models/Project');
const File = require('../models/File');
const User = require('../models/User');

// Helper function to recursively delete files and folders
const deleteNestedFiles = async (projectId, parentId = null) => {
  const files = await File.find({ projectId, parentId });
  for (const file of files) {
    if (file.type === 'folder') {
      await deleteNestedFiles(projectId, file._id);
    }
    await File.findByIdAndDelete(file._id);
  }
};

const createProject = async (req, res) => {
  try {
    const { name, description, visibility } = req.body;
    const project = new Project({
      name,
      description,
      visibility,
      owner: req.user.userId
    });
    await project.save();
    res.status(201).json({
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user.userId });
    res.json({ projects });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      owner: req.user.userId
    });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ project });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const { name, description, visibility } = req.body;
    const project = await Project.findOneAndUpdate(
      { _id: req.params.projectId, owner: req.user.userId },
      { name, description, visibility },
      { new: true, runValidators: true }
    );
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({
      message: 'Project updated successfully',
      project
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const addCollaborator = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userId } = req.body;

    // Check if project exists and user is owner
    const project = await Project.findOne({ _id: projectId, owner: req.user.userId });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user to add exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is already a collaborator
    if (project.collaborators.includes(userId)) {
      return res.status(400).json({ message: 'User is already a collaborator' });
    }

    // Add collaborator
    project.collaborators.push(userId);
    await project.save();

    res.json({
      message: 'Collaborator added successfully',
      project
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getCollaborators = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Check if project exists and user is owner or collaborator
    const project = await Project.findOne({
      _id: projectId,
      $or: [
        { owner: req.user.userId },
        { collaborators: req.user.userId }
      ]
    }).populate('collaborators', 'name email').populate('owner', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({
      owner: project.owner,
      collaborators: project.collaborators
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const removeCollaborator = async (req, res) => {
  try {
    const { projectId, userId } = req.params;

    // Check if project exists and user is owner
    const project = await Project.findOne({ _id: projectId, owner: req.user.userId });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is a collaborator
    if (!project.collaborators.includes(userId)) {
      return res.status(400).json({ message: 'User is not a collaborator' });
    }

    // Remove collaborator
    project.collaborators = project.collaborators.filter(id => id.toString() !== userId);
    await project.save();

    res.json({
      message: 'Collaborator removed successfully',
      project
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.projectId,
      owner: req.user.userId
    });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    // Delete all nested files and folders
    await deleteNestedFiles(req.params.projectId);
    res.json({ message: 'Project and all associated files deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  addCollaborator,
  getCollaborators,
  removeCollaborator,
  deleteProject
};
