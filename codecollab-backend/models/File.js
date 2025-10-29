const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['file', 'folder'],
    required: true
  },
  content: {
    type: String,
    default: '' // Only for files
  },
  language: {
    type: String,
    default: 'plaintext' // Programming language for syntax highlighting
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
    default: null // Root level if null
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('File', fileSchema);
