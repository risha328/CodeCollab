const Project = require('../models/Project');
const File = require('../models/File');

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
  deleteProject
};
