const express = require('express');
const router = express.Router({ mergeParams: true });
const auth = require('../middleware/auth');
const {
  createFile,
  getFiles,
  getFile,
  getFileContent,
  updateFileContent,
  renameFile,
  updateFile,
  deleteFile
} = require('../controllers/fileController');

// All routes are protected
router.post('/', auth, createFile);
router.get('/', auth, getFiles);
router.get('/:fileId', auth, getFile);
router.get('/:fileId/content', auth, getFileContent);
router.put('/:fileId/content', auth, updateFileContent);
router.post('/:fileId/rename', auth, renameFile);
router.put('/:fileId', auth, updateFile);
router.delete('/:fileId', auth, deleteFile);

module.exports = router;
