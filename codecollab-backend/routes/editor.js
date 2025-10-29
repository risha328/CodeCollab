const express = require('express');
const router = express.Router();
const { getFileContent, saveFileContent } = require('../controllers/editorController');
const auth = require('../middleware/auth');

// Get file content for editing
router.get('/files/:fileId', auth, getFileContent);

// Save file content
router.put('/files/:fileId', auth, saveFileContent);

module.exports = router;
