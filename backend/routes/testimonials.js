const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const {
  createTestimonial,
  getApprovedTestimonials,
  getMyTestimonial,
  getAllTestimonials,
  updateTestimonialStatus,
} = require('../controllers/testimonialController');

// Público — ver testimonios aprobados
router.get('/', getApprovedTestimonials);

// Cliente autenticado
router.post('/', auth, createTestimonial);
router.get('/my', auth, getMyTestimonial);

// Admin
router.get('/admin', adminAuth, getAllTestimonials);
router.put('/:id', adminAuth, updateTestimonialStatus);

module.exports = router;
