const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');

// All routes are protected
router.post('/', auth, createProject);
router.get('/', auth, getProjects);
router.get('/:projectId', auth, getProject);
router.put('/:projectId', auth, updateProject);
router.delete('/:projectId', auth, deleteProject);

module.exports = router;
