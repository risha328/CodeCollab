const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['project_created', 'file_created', 'file_updated', 'file_deleted', 'folder_created', 'folder_deleted', 'collaborator_added', 'collaborator_removed', 'project_updated']
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Activity', activitySchema);
