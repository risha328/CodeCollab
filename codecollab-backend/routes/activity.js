const express = require('express');
const router = express.Router({ mergeParams: true });
const auth = require('../middleware/auth');
const {
  getActivity,
  getVersions,
  restoreVersion
} = require('../controllers/activityController');

// All routes are protected
router.get('/activity', auth, getActivity);
router.get('/versions', auth, getVersions);
router.post('/versions/restore/:versionId', auth, restoreVersion);

module.exports = router;
