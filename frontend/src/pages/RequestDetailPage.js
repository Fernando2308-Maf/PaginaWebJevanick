import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { advisoryService } from '../services/api';
import { LoadingSpinner, AlertBox } from '../components/UI';

export const RequestDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRequest();
  }, [id]);

  const loadRequest = async () => {
    try {
      const res = await advisoryService.getRequestById(id);
      setRequest(res.data.request);
    } catch (err) {
      setError('Error al cargar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { emoji: '⏳', text: 'Pendiente', colors: 'bg-yellow-100 text-yellow-900' },
      in_progress: { emoji: '⚙️', text: 'En Progreso', colors: 'bg-blue-100 text-blue-900' },
      completed: { emoji: '✅', text: 'Completado', colors: 'bg-green-100 text-green-900' },
      rejected: { emoji: '❌', text: 'Rechazado', colors: 'bg-red-100 text-red-900' },
    };
    return badges[status] || { emoji: '❓', text: status, colors: 'bg-gray-100 text-gray-900' };
  };

  const getPriorityIcon = (priority) => {
    const icons = {
      low: { emoji: '🟢', text: 'Baja' },
      medium: { emoji: '🟡', text: 'Media' },
      high: { emoji: '🔴', text: 'Alta' },
    };
    return icons[priority] || { emoji: '⭕', text: priority };
  };

  if (loading) return <LoadingSpinner />;

  if (!request) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <AlertBox type="error" message="Solicitud no encontrada" />
          <button
            onClick={() => navigate('/client/dashboard')}
            className="btn-primary text-lg px-8 py-4 font-bold rounded-xl mt-6 inline-flex items-center gap-2"
          >
            ← Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(request.status);
  const priorityInfo = getPriorityIcon(request.priority);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 animate-fadeIn">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate('/client/dashboard')}
          className="text-primary hover:text-secondary font-bold flex items-center gap-2 mb-8 transition"
        >
          ← Volver al Dashboard
        </button>

        {/* Main Card */}
        <div className="glass backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white border-opacity-20 animate-slideUp">
          {/* Header */}
          <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
            <div>
              <h1 className="text-5xl font-black gradient-text mb-2">{request.title}</h1>
              <div className="flex gap-3 flex-wrap">
                <span className={`px-4 py-2 rounded-full text-sm font-bold ${statusBadge.colors}`}>
                  {statusBadge.emoji} {statusBadge.text}
                </span>
                <span className="px-4 py-2 rounded-full text-sm font-bold bg-purple-100 text-purple-900">
                  {priorityInfo.emoji} Prioridad: {priorityInfo.text}
                </span>
              </div>
            </div>
          </div>

          {/* Meta Info */}
          <div className="grid md:grid-cols-3 gap-4 mb-8 p-6 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl">
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">📅 Fecha de Creación</p>
              <p className="font-bold text-primary">
                {new Date(request.createdAt).toLocaleDateString('es-ES', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">⏱️ Última Actualización</p>
              <p className="font-bold text-primary">
                {new Date(request.updatedAt).toLocaleDateString('es-ES', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">👤 Asesor Asignado</p>
              <p className="font-bold text-primary">
                {request.assignedToAdmin ? request.assignedToAdmin.name : 'No asignado'}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">📝 Descripción</h2>
            <div className="bg-white bg-opacity-70 border-2 border-blue-200 rounded-2xl p-6 text-gray-800 leading-relaxed">
              {request.description}
            </div>
          </div>

          {/* Feedback Section */}
          {request.feedback && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4">💬 Retroalimentación del Asesor</h2>
              <div className="bg-gradient-to-br from-green-100 to-teal-100 border-2 border-green-300 rounded-2xl p-6 text-gray-800 leading-relaxed">
                {request.feedback}
              </div>
            </div>
          )}

          {/* Attachments */}
          {request.attachments && request.attachments.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4">📎 Archivos Adjuntos</h2>
              <div className="space-y-2">
                {request.attachments.map((attachment, idx) => (
                  <a
                    key={idx}
                    href={attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-white border-2 border-blue-200 rounded-xl hover:border-secondary hover:bg-blue-50 transition"
                  >
                    <span className="text-2xl">📄</span>
                    <span className="font-bold text-primary flex-1 truncate">{attachment.split('/').pop()}</span>
                    <span className="text-secondary font-bold">↗️</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Status Timeline */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">📊 Estado del Proceso</h2>
            <div className="space-y-3">
              {[
                { status: 'pending', emoji: '⏳', label: 'Solicitud Recibida' },
                { status: 'in_progress', emoji: '⚙️', label: 'En Revisión' },
                { status: 'completed', emoji: '✅', label: 'Completado' },
              ].map((step) => {
                const isCompleted = 
                  (request.status === 'completed' && step.status === 'completed') ||
                  (request.status === 'in_progress' && ['pending', 'in_progress'].includes(step.status)) ||
                  (request.status === 'pending' && step.status === 'pending');
                const isCurrent = request.status === step.status;

                return (
                  <div
                    key={step.status}
                    className={`p-4 rounded-xl border-2 transition ${
                      isCurrent
                        ? 'border-secondary bg-gradient-to-r from-secondary to-accent text-white'
                        : isCompleted
                        ? 'border-green-400 bg-green-100 text-green-900'
                        : 'border-gray-300 bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 font-bold">
                      <span className="text-2xl">{step.emoji}</span>
                      <span>{step.label}</span>
                      {isCompleted && <span className="ml-auto">✓</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-8 border-t-2 border-blue-200">
            <button
              onClick={() => navigate('/client/dashboard')}
              className="flex-1 btn-primary text-lg px-6 py-4 font-bold rounded-xl inline-flex items-center justify-center gap-2"
            >
              ← Volver
            </button>
            <button
              onClick={() => navigate('/client/new-request')}
              className="flex-1 btn-secondary text-lg px-6 py-4 font-bold rounded-xl inline-flex items-center justify-center gap-2"
            >
              ➕ Nueva Solicitud
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
