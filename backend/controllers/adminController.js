const User = require('../models/User');
const AdvisoryRequest = require('../models/AdvisoryRequest');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const { role, status } = req.query;
    let filter = {};

    if (role) filter.role = role;
    if (status) filter.status = status;

    const users = await User.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user status
exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'inactive', 'suspended'].includes(status)) {
      return res.status(400).json({ message: 'Estado inválido' });
    }

    const user = await User.findByIdAndUpdate(id, { status }, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({
      success: true,
      message: 'Usuario actualizado',
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({
      success: true,
      message: 'Usuario eliminado',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'client' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalRequests = await AdvisoryRequest.countDocuments();
    const pendingRequests = await AdvisoryRequest.countDocuments({ status: 'pending' });
    const completedRequests = await AdvisoryRequest.countDocuments({ status: 'completed' });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalAdmins,
        totalRequests,
        pendingRequests,
        completedRequests,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
