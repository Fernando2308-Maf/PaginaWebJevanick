const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
  getDashboardStats,
} = require('../controllers/adminController');
const {
  getAllRequests,
  updateRequestStatus,
  deleteRequest,
} = require('../controllers/advisoryController');
const { auth, adminAuth } = require('../middleware/auth');

// User management
router.get('/users', adminAuth, getAllUsers);
router.get('/users/:id', adminAuth, getUserById);
router.put('/users/:id', adminAuth, updateUserStatus);
router.delete('/users/:id', adminAuth, deleteUser);

// Dashboard stats
router.get('/dashboard/stats', adminAuth, getDashboardStats);

// Advisory request management
router.get('/requests', adminAuth, getAllRequests);
router.put('/requests/:id', adminAuth, updateRequestStatus);
router.delete('/requests/:id', adminAuth, deleteRequest);

module.exports = router;
