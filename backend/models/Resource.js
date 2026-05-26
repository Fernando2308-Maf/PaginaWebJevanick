const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Por favor ingresa un título'],
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['guía', 'video', 'plantilla', 'artículo', 'taller'],
      required: true,
    },
    fileUrl: {
      type: String,
      default: null,
    },
    videoUrl: {
      type: String,
      default: null,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resource', resourceSchema);
