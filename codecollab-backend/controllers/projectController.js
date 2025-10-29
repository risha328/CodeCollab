const Project = require('../models/Project');
const File = require('../models/File');
const User = require('../models/User');
const Activity = require('../models/Activity');

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
    const { name, description, about, visibility } = req.body;
    const project = new Project({
      name,
      description,
      about,
      visibility,
      owner: req.user.userId
    });
    await project.save();

    // Log activity
    try {
      const activity = new Activity({
        projectId: project._id,
        userId: req.user.userId,
        action: 'project_created',
        details: {
          projectName: name,
          visibility
        }
      });
      await activity.save();
    } catch (error) {
      console.error('Failed to log project creation activity:', error);
    }

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
    const projects = await Project.find({
      $or: [
        { owner: req.user.userId },
        { collaborators: req.user.userId }
      ]
    });
    res.json({ projects });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      $or: [
        { owner: req.user.userId },
        { collaborators: req.user.userId }
      ]
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
    const { name, description, about, visibility } = req.body;
    const project = await Project.findOneAndUpdate(
      { _id: req.params.projectId, owner: req.user.userId },
      { name, description, about, visibility },
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

    let user;
    // Check if userId is an email or user ID
    if (userId.includes('@')) {
      // It's an email, find user by email
      user = await User.findOne({ email: userId });
    } else {
      // It's a user ID
      user = await User.findById(userId);
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is already a collaborator
    if (project.collaborators.includes(user._id)) {
      return res.status(400).json({ message: 'User is already a collaborator' });
    }

    // Add collaborator
    project.collaborators.push(user._id);
    await project.save();

    // Log activity
    try {
      const activity = new Activity({
        projectId,
        userId: req.user.userId,
        action: 'collaborator_added',
        details: {
          addedUserId: user._id,
          addedUserName: user.name
        }
      });
      await activity.save();
    } catch (error) {
      console.error('Failed to log collaborator addition activity:', error);
    }

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

    // Get user details for logging
    const removedUser = await User.findById(userId);

    // Remove collaborator
    project.collaborators = project.collaborators.filter(id => id.toString() !== userId);
    await project.save();

    // Log activity
    try {
      const activity = new Activity({
        projectId,
        userId: req.user.userId,
        action: 'collaborator_removed',
        details: {
          removedUserId: userId,
          removedUserName: removedUser ? removedUser.name : 'Unknown'
        }
      });
      await activity.save();
    } catch (error) {
      console.error('Failed to log collaborator removal activity:', error);
    }

    res.json({
      message: 'Collaborator removed successfully',
      project
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getProjectSettings = async (req, res) => {
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
      return res.status(404).json({ message: 'Project not found or access denied' });
    }

    // Return settings (visibility and permissions)
    const settings = {
      visibility: project.visibility,
      permissions: {
        allowCollaboratorsToEdit: project.allowCollaboratorsToEdit || false,
        allowPublicRead: project.allowPublicRead || false
      }
    };

    res.json({ settings });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateProjectSettings = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { visibility, permissions } = req.body;

    // Check if project exists and user is owner
    const project = await Project.findOne({ _id: projectId, owner: req.user.userId });
    if (!project) {
      return res.status(404).json({ message: 'Project not found or access denied' });
    }

    // Update settings
    if (visibility) project.visibility = visibility;
    if (permissions) {
      project.allowCollaboratorsToEdit = permissions.allowCollaboratorsToEdit;
      project.allowPublicRead = permissions.allowPublicRead;
    }

    await project.save();

    // Log activity
    try {
      const activity = new Activity({
        projectId,
        userId: req.user.userId,
        action: 'settings_updated',
        details: {
          visibility,
          permissions
        }
      });
      await activity.save();
    } catch (error) {
      console.error('Failed to log settings update activity:', error);
    }

    res.json({
      message: 'Project settings updated successfully',
      settings: {
        visibility: project.visibility,
        permissions: {
          allowCollaboratorsToEdit: project.allowCollaboratorsToEdit,
          allowPublicRead: project.allowPublicRead
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const searchProjects = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Search projects where user is owner, collaborator, or project is public
    const projects = await Project.find({
      $and: [
        {
          $or: [
            { owner: req.user.userId },
            { collaborators: req.user.userId },
            { visibility: 'public' }
          ]
        },
        {
          $or: [
            { name: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } }
          ]
        }
      ]
    }).populate('owner', 'name email');

    res.json({ projects });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Search users by name or email
    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ]
    }).select('name email _id');

    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const searchProjectFiles = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Check if project exists and user has access
    const project = await Project.findOne({
      _id: projectId,
      $or: [
        { owner: req.user.userId },
        { collaborators: req.user.userId },
        { visibility: 'public' }
      ]
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found or access denied' });
    }

    // Search files by name
    const files = await File.find({
      projectId,
      name: { $regex: q, $options: 'i' }
    });

    res.json({ files });
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
  getProjectSettings,
  updateProjectSettings,
  searchProjects,
  searchUsers,
  searchProjectFiles,
  deleteProject
};
