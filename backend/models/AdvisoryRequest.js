const mongoose = require('mongoose');

const advisoryRequestSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Por favor ingresa un título'],
      enum: [
        'Optimización de Currículum',
        'Carta de Presentación',
        'Perfil Profesional',
        'Preparación para Entrevista',
        'Desarrollo de Habilidades',
      ],
    },
    description: {
      type: String,
      required: [true, 'Por favor describe tu solicitud'],
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'rejected'],
      default: 'pending',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    assignedToAdmin: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      default: null,
    },
    attachments: [
      {
        filename: String,
        url: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    feedback: {
      type: String,
      default: null,
    },
    feedbackFile: {
      type: String,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AdvisoryRequest', advisoryRequestSchema);
