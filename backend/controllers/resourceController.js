const Resource = require('../models/Resource');

// Get all resources
exports.getAllResources = async (req, res) => {
  try {
    const { category } = req.query;
    let filter = { isPublic: true };

    if (category) filter.category = category;

    const resources = await Resource.find(filter)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      resources,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create resource (admin only)
exports.createResource = async (req, res) => {
  try {
    const { title, description, category, fileUrl, videoUrl } = req.body;

    const resource = new Resource({
      title,
      description,
      category,
      fileUrl,
      videoUrl,
      createdBy: req.user.id,
    });

    await resource.save();

    res.status(201).json({
      success: true,
      message: 'Recurso creado exitosamente',
      resource,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update resource
exports.updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, fileUrl, videoUrl } = req.body;

    const resource = await Resource.findByIdAndUpdate(
      id,
      { title, description, category, fileUrl, videoUrl },
      { new: true }
    );

    if (!resource) {
      return res.status(404).json({ message: 'Recurso no encontrado' });
    }

    res.status(200).json({
      success: true,
      message: 'Recurso actualizado',
      resource,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete resource
exports.deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Recurso no encontrado' });
    }

    res.status(200).json({
      success: true,
      message: 'Recurso eliminado',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
