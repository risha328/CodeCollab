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
  getProjectSettings,
  updateProjectSettings,
  searchProjects,
  searchProjectFiles,
  deleteProject
} = require('../controllers/projectController');

// All routes are protected
router.post('/', auth, createProject);
router.get('/', auth, getProjects);

// Search routes (must come before parameterized routes)
router.get('/search', auth, searchProjects);
router.get('/:projectId/files/search', auth, searchProjectFiles);

router.get('/:projectId', auth, getProject);
router.put('/:projectId', auth, updateProject);

// Collaborator routes
router.post('/:projectId/collaborators', auth, addCollaborator);
router.get('/:projectId/collaborators', auth, getCollaborators);
router.delete('/:projectId/collaborators/:userId', auth, removeCollaborator);

// Settings routes
router.get('/:projectId/settings', auth, getProjectSettings);
router.put('/:projectId/settings', auth, updateProjectSettings);

router.delete('/:projectId', auth, deleteProject);

module.exports = router;
