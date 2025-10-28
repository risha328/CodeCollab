const Activity = require('../models/Activity');
const Project = require('../models/Project');

const getActivity = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { limit = 20 } = req.query;

    // Check if project exists and user has access
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

    const activities = await Activity.find({ projectId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({ activities });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getVersions = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Check if project exists and user has access
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

    const Version = require('../models/Version');
    const versions = await Version.find({ projectId })
      .populate('fileId', 'name type')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ versions });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const restoreVersion = async (req, res) => {
  try {
    const { projectId, versionId } = req.params;

    // Check if project exists and user has access
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

    const Version = require('../models/Version');
    const File = require('../models/File');

    const version = await Version.findById(versionId);
    if (!version || version.projectId.toString() !== projectId) {
      return res.status(404).json({ message: 'Version not found' });
    }

    const file = await File.findById(version.fileId);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Create new version with current content before restoring
    const currentVersion = new Version({
      projectId,
      fileId: file._id,
      versionNumber: await Version.countDocuments({ fileId: file._id }) + 1,
      content: file.content,
      changes: 'Auto-saved before restore',
      createdBy: req.user.userId
    });
    await currentVersion.save();

    // Restore the selected version
    file.content = version.content;
    await file.save();

    // Log activity
    const activity = new Activity({
      projectId,
      userId: req.user.userId,
      action: 'file_updated',
      details: {
        fileId: file._id,
        fileName: file.name,
        action: 'version_restored',
        restoredVersion: version.versionNumber
      }
    });
    await activity.save();

    res.json({
      message: 'Version restored successfully',
      file,
      version: version.versionNumber
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getActivity,
  getVersions,
  restoreVersion
};
