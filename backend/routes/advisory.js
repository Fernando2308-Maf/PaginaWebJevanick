const express = require('express');
const router = express.Router();
const {
  createRequest,
  getMyRequests,
  getRequestById,
  updateRequest,
} = require('../controllers/advisoryController');
const { auth } = require('../middleware/auth');

router.post('/', auth, createRequest);
router.get('/my-requests', auth, getMyRequests);
router.get('/:id', auth, getRequestById);
router.put('/:id', auth, updateRequest);

module.exports = router;
