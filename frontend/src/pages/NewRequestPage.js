import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { advisoryService } from '../services/api';
import { AlertBox, Card } from '../components/UI';

export const NewRequestPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const advisoryTypes = [
    { value: 'Optimización de Currículum', emoji: '📝' },
    { value: 'Carta de Presentación', emoji: '💼' },
    { value: 'Perfil Profesional', emoji: '🎯' },
    { value: 'Preparación para Entrevista', emoji: '🎤' },
    { value: 'Desarrollo de Habilidades', emoji: '🚀' },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await advisoryService.createRequest(formData.title, formData.description);
      setSuccess('¡Solicitud creada exitosamente!');
      setTimeout(() => {
        navigate('/client/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 animate-fadeIn">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 animate-slideUp">
          <h1 className="text-6xl font-black gradient-text mb-3">Nueva Solicitud</h1>
          <p className="text-xl text-gray-600 font-medium">¿Qué tipo de asesoría necesitas hoy?</p>
        </div>

        {error && <AlertBox type="error" message={error} />}
        {success && <AlertBox type="success" message={success} />}

        {/* Form Card */}
        <div className="glass backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-white border-opacity-20 animate-slideUp">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Advisory Type Selection */}
            <div>
              <label className="block text-gray-800 font-bold text-lg mb-4 flex items-center gap-2">
                📋 Tipo de Asesoría <span className="text-accent">*</span>
              </label>
              <div className="grid md:grid-cols-2 gap-3">
                {advisoryTypes.map(type => (
                  <label key={type.value} className="cursor-pointer group">
                    <input
                      type="radio"
                      name="title"
                      value={type.value}
                      checked={formData.title === type.value}
                      onChange={handleChange}
                      className="sr-only"
                      required
                    />
                    <div className={`p-4 rounded-2xl border-2 transition-all duration-300 flex items-center gap-3 ${
                      formData.title === type.value
                        ? 'border-secondary bg-gradient-to-r from-secondary to-accent text-white shadow-lg scale-105'
                        : 'border-blue-200 bg-white text-gray-700 group-hover:border-secondary group-hover:shadow-lg'
                    }`}>
                      <span className="text-2xl">{type.emoji}</span>
                      <span className="font-bold">{type.value}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-800 font-bold text-lg mb-4 flex items-center gap-2">
                ✍️ Descripción Detallada <span className="text-accent">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="6"
                className="w-full px-6 py-4 bg-white bg-opacity-70 border-2 border-blue-200 rounded-2xl focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary focus:ring-opacity-30 resize-none text-gray-800 placeholder-gray-500 font-medium transition"
                placeholder="Cuéntanos detalladamente qué necesitas. Por ejemplo: mi experiencia, mis habilidades, los obstáculos que enfrento, etc."
                required
              />
              <p className="text-sm text-gray-600 mt-2 font-medium">💡 Cuanta más información proporciones, mejor será la asesoría que recibas.</p>
            </div>

            {/* Info Box */}
            <div className="bg-gradient-to-r from-cyan-100 to-teal-100 border-2 border-cyan-300 rounded-2xl p-6">
              <p className="text-gray-800 font-semibold flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">💡</span>
                <span>Nuestros expertos revisarán tu solicitud y se pondrán en contacto contigo en las próximas 24 horas.</span>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary text-lg px-6 py-4 font-bold rounded-xl transition disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                {loading ? '⏳ Enviando...' : '🚀 Enviar Solicitud'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/client/dashboard')}
                className="flex-1 btn-outline text-lg px-6 py-4 font-bold rounded-xl transition inline-flex items-center justify-center gap-2"
              >
                ← Cancelar
              </button>
            </div>
          </form>
        </div>

        {/* Tips Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-4">
          {[
            { emoji: '📝', title: 'Sé Específico', desc: 'Proporciona contexto sobre tu situación actual' },
            { emoji: '🎯', title: 'Define Objetivos', desc: 'Menciona qué resultado esperas lograr' },
            { emoji: '⏱️', title: 'Se Realista', desc: 'Indica si necesitas urgencia en la respuesta' },
          ].map((tip, idx) => (
            <div key={idx} className="card-premium text-center animate-fadeIn" style={{ animationDelay: `${idx * 100}ms` }}>
              <div className="text-4xl mb-2">{tip.emoji}</div>
              <p className="font-bold text-primary mb-1">{tip.title}</p>
              <p className="text-sm text-gray-600">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
