const express = require('express');
const router = express.Router();
const {
  getAllResources,
  createResource,
  updateResource,
  deleteResource,
} = require('../controllers/resourceController');
const { auth, adminAuth } = require('../middleware/auth');

router.get('/', getAllResources);
router.post('/', adminAuth, createResource);
router.put('/:id', adminAuth, updateResource);
router.delete('/:id', adminAuth, deleteResource);

module.exports = router;
