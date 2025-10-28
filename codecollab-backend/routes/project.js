const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  addCollaborator,
  getCollaborators,
  removeCollaborator,
  deleteProject
} = require('../controllers/projectController');

// All routes are protected
router.post('/', auth, createProject);
router.get('/', auth, getProjects);
router.get('/:projectId', auth, getProject);
router.put('/:projectId', auth, updateProject);

// Collaborator routes
router.post('/:projectId/collaborators', auth, addCollaborator);
router.get('/:projectId/collaborators', auth, getCollaborators);
router.delete('/:projectId/collaborators/:userId', auth, removeCollaborator);

router.delete('/:projectId', auth, deleteProject);

module.exports = router;
