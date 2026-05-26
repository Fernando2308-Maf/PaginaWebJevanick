const Testimonial = require('../models/Testimonial');
const User = require('../models/User');

// POST /api/testimonials  — cliente autenticado envía su opinión
const createTestimonial = async (req, res) => {
  try {
    const { text, rating } = req.body;

    if (!text || text.trim().length < 10) {
      return res.status(400).json({ message: 'La opinión debe tener al menos 10 caracteres' });
    }

    // Un cliente solo puede tener un testimonio pendiente o aprobado
    const existing = await Testimonial.findOne({
      clientId: req.user.id,
      status: { $in: ['pending', 'approved'] },
    });

    if (existing) {
      return res.status(400).json({ message: 'Ya tienes una opinión enviada. Espera a que sea revisada o aprobada.' });
    }

    // Obtener el nombre del usuario (el JWT no incluye 'name', solo id/role/email)
    const user = await User.findById(req.user.id).select('name');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const testimonial = await Testimonial.create({
      clientId: req.user.id,
      clientName: user.name,
      text: text.trim(),
      rating: rating || 5,
    });

    res.status(201).json({ message: '¡Gracias por tu opinión! Será publicada pronto.', testimonial });
  } catch (err) {
    res.status(500).json({ message: 'Error al enviar la opinión', error: err.message });
  }
};

// GET /api/testimonials  — público, devuelve solo aprobados
const getApprovedTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ status: 'approved' })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ testimonials });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener testimonios' });
  }
};

// GET /api/testimonials/my  — cliente ve su propio testimonio
const getMyTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findOne({
      clientId: req.user.id,
      status: { $in: ['pending', 'approved'] },
    });

    res.json({ testimonial: testimonial || null });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener tu opinión' });
  }
};

// GET /api/testimonials/admin  — admin ve todos
const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find()
      .sort({ createdAt: -1 });

    res.json({ testimonials });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener testimonios' });
  }
};

// PUT /api/testimonials/:id  — admin aprueba o rechaza
const updateTestimonialStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Estado inválido' });
    }

    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonio no encontrado' });
    }

    res.json({ message: 'Estado actualizado', testimonial });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar', error: err.message });
  }
};

module.exports = {
  createTestimonial,
  getApprovedTestimonials,
  getMyTestimonial,
  getAllTestimonials,
  updateTestimonialStatus,
};
