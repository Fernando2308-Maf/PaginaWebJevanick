const AdvisoryRequest = require('../models/AdvisoryRequest');
const User = require('../models/User');

// Client: Create advisory request
exports.createRequest = async (req, res) => {
  try {
    const { title, description } = req.body;
    const clientId = req.user.id;

    const advisoryRequest = new AdvisoryRequest({
      clientId,
      title,
      description,
    });

    await advisoryRequest.save();

    res.status(201).json({
      success: true,
      message: 'Solicitud creada exitosamente',
      advisoryRequest,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Client: Get my requests
exports.getMyRequests = async (req, res) => {
  try {
    const requests = await AdvisoryRequest.find({ clientId: req.user.id })
      .populate('assignedToAdmin', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Client: Get single request
exports.getRequestById = async (req, res) => {
  try {
    const request = await AdvisoryRequest.findById(req.params.id)
      .populate('clientId', 'name email phone')
      .populate('assignedToAdmin', 'name email');

    if (!request) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    // Check if user is owner or admin
    if (request.clientId._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No autorizado' });
    }

    res.status(200).json({
      success: true,
      request,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Client: Update request (add attachments)
exports.updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await AdvisoryRequest.findById(id);

    if (!request) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    if (request.clientId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    if (req.body.description) request.description = req.body.description;
    if (req.body.title) request.title = req.body.title;

    await request.save();

    res.status(200).json({
      success: true,
      message: 'Solicitud actualizada',
      request,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Get all requests
exports.getAllRequests = async (req, res) => {
  try {
    const { status, priority } = req.query;
    let filter = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const requests = await AdvisoryRequest.find(filter)
      .populate('clientId', 'name email phone')
      .populate('assignedToAdmin', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Update request status
exports.updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedToAdmin, feedback, priority } = req.body;

    const request = await AdvisoryRequest.findByIdAndUpdate(
      id,
      { status, assignedToAdmin, feedback, priority },
      { new: true }
    )
      .populate('clientId', 'name email')
      .populate('assignedToAdmin', 'name email');

    if (!request) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    res.status(200).json({
      success: true,
      message: 'Solicitud actualizada',
      request,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Delete request
exports.deleteRequest = async (req, res) => {
  try {
    const request = await AdvisoryRequest.findByIdAndDelete(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    res.status(200).json({
      success: true,
      message: 'Solicitud eliminada',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
