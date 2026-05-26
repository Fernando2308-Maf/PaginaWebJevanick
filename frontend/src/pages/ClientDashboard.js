import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { advisoryService, testimonialService } from '../services/api';
import { LoadingSpinner, AlertBox } from '../components/UI';
import { AuthContext } from '../context/AuthContext';

const STATUS_CONFIG = {
  pending:     { label: 'Pendiente',   dot: 'bg-amber-400',   badge: 'badge-warning', bar: 'bg-amber-400' },
  in_progress: { label: 'En Progreso', dot: 'bg-blue-500',    badge: 'badge-info',    bar: 'bg-blue-500' },
  completed:   { label: 'Completado',  dot: 'bg-emerald-500', badge: 'badge-success', bar: 'bg-emerald-500' },
  rejected:    { label: 'Rechazado',   dot: 'bg-red-500',     badge: 'badge-danger',  bar: 'bg-red-500' },
};

const FILTERS = [
  { key: 'all',         label: 'Todas' },
  { key: 'pending',     label: 'Pendientes' },
  { key: 'in_progress', label: 'En Progreso' },
  { key: 'completed',   label: 'Completadas' },
  { key: 'rejected',    label: 'Rechazadas' },
];

/* ── Star Rating Component ── */
const StarRating = ({ value, onChange, readOnly = false }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map(star => (
      <button
        key={star}
        type="button"
        disabled={readOnly}
        onClick={() => !readOnly && onChange(star)}
        className={`text-3xl transition-transform duration-100 ${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
        style={{ filter: star <= value ? 'none' : 'grayscale(1) opacity(0.35)' }}
      >
        ⭐
      </button>
    ))}
  </div>
);

/* ── Status label for existing testimonial ── */
const TESTIMONIAL_STATUS = {
  pending:  { label: 'En revisión',   bg: 'bg-amber-100',   text: 'text-amber-700',   icon: '⏳' },
  approved: { label: 'Publicada',     bg: 'bg-emerald-100', text: 'text-emerald-700', icon: '✅' },
  rejected: { label: 'No aprobada',   bg: 'bg-red-100',     text: 'text-red-700',     icon: '❌' },
};

export const ClientDashboard = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  /* ── Testimonial state ── */
  const [myTestimonial, setMyTestimonial]       = useState(null);
  const [testimonialLoading, setTestimonialLoading] = useState(true);
  const [testimonialText, setTestimonialText]   = useState('');
  const [testimonialRating, setTestimonialRating] = useState(5);
  const [testimonialSaving, setTestimonialSaving] = useState(false);
  const [testimonialSuccess, setTestimonialSuccess] = useState('');
  const [testimonialError, setTestimonialError]   = useState('');

  useEffect(() => {
    advisoryService.getMyRequests()
      .then(res => setRequests(res.data.requests))
      .catch(() => setError('Error al cargar las solicitudes'))
      .finally(() => setLoading(false));

    testimonialService.getMy()
      .then(res => setMyTestimonial(res.data.testimonial))
      .catch(() => {}) // silently ignore if API fails
      .finally(() => setTestimonialLoading(false));
  }, []);

  const handleTestimonialSubmit = async (e) => {
    e.preventDefault();
    setTestimonialError('');
    setTestimonialSuccess('');
    if (testimonialText.trim().length < 10) {
      setTestimonialError('La opinión debe tener al menos 10 caracteres');
      return;
    }
    setTestimonialSaving(true);
    try {
      const res = await testimonialService.create(testimonialText.trim(), testimonialRating);
      setMyTestimonial(res.data.testimonial);
      setTestimonialSuccess('¡Gracias! Tu opinión fue enviada y será publicada pronto.');
      setTestimonialText('');
    } catch (err) {
      setTestimonialError(err.response?.data?.message || 'Error al enviar la opinión');
    } finally {
      setTestimonialSaving(false);
    }
  };

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter);

  const counts = {
    total:       requests.length,
    pending:     requests.filter(r => r.status === 'pending').length,
    in_progress: requests.filter(r => r.status === 'in_progress').length,
    completed:   requests.filter(r => r.status === 'completed').length,
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="dash-page animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Page header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-slideUp">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Bienvenido de vuelta</p>
            <h1 className="text-3xl font-black gradient-text">{user?.name || 'Mis Asesorías'}</h1>
          </div>
          <Link to="/client/new-request" className="btn-primary text-sm px-5 py-2.5 font-bold inline-flex items-center gap-2 self-start">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nueva Solicitud
          </Link>
        </div>

        {error && <AlertBox type="error" message={error} />}

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total',       value: counts.total,       icon: '📋', color: 'from-slate-400 to-slate-500' },
            { label: 'Pendientes',  value: counts.pending,     icon: '⏳', color: 'from-amber-400 to-amber-500' },
            { label: 'En Progreso', value: counts.in_progress, icon: '⚡', color: 'from-blue-500 to-blue-600' },
            { label: 'Completadas', value: counts.completed,   icon: '✅', color: 'from-emerald-500 to-emerald-600' },
          ].map((s, i) => (
            <div key={i} className="card-stat animate-fadeIn" style={{ animationDelay: `${i * 80}ms` }}>
              <div className={`bg-gradient-to-br ${s.color} w-11 h-11 rounded-xl flex items-center justify-center text-xl shadow-md shrink-0`}>
                {s.icon}
              </div>
              <div>
                <p className="text-gray-500 text-xs font-medium">{s.label}</p>
                <p className="text-2xl font-black text-gray-900">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {requests.length === 0 ? (
          /* Empty state */
          <div className="bg-white rounded-2xl shadow-card p-16 text-center animate-slideUp">
            <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4">📋</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Sin solicitudes aún</h3>
            <p className="text-gray-500 text-sm mb-8 max-w-sm mx-auto">
              Crea tu primera solicitud de asesoría y comienza tu camino profesional
            </p>
            <Link to="/client/new-request" className="btn-primary text-sm px-6 py-3 font-bold inline-flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Crear Solicitud
            </Link>
          </div>
        ) : (
          <>
            {/* ── Filter tabs ── */}
            <div className="flex gap-2 flex-wrap mb-6 animate-slideUp">
              {FILTERS.map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    filter === f.key
                      ? 'bg-primary text-white shadow-glow-primary'
                      : 'bg-white text-gray-600 shadow-card hover:shadow-card-hover border border-slate-100'
                  }`}
                >
                  {f.label}
                  {f.key !== 'all' && (
                    <span className={`ml-1.5 text-xs font-bold px-1.5 py-0.5 rounded-md ${filter === f.key ? 'bg-white/20' : 'bg-slate-100 text-gray-500'}`}>
                      {requests.filter(r => f.key === 'all' || r.status === f.key).length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* ── Request list ── */}
            <div className="space-y-3">
              {filtered.map((req, idx) => {
                const cfg = STATUS_CONFIG[req.status] || STATUS_CONFIG.pending;
                return (
                  <div
                    key={req._id}
                    className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden group hover:shadow-card-hover transition-all duration-300 animate-slideUp"
                    style={{ animationDelay: `${idx * 40}ms` }}
                  >
                    <div className={`h-1 w-full ${cfg.bar}`}></div>
                    <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={`badge ${cfg.badge} text-xs`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
                            {cfg.label}
                          </span>
                          {req.priority && (
                            <span className="badge badge-gray text-xs capitalize">
                              Prioridad {req.priority}
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-bold text-gray-900 truncate group-hover:text-primary transition-colors">
                          {req.title}
                        </h3>
                        <p className="text-gray-500 text-sm mt-1 line-clamp-1">{req.description}</p>
                        <p className="text-gray-400 text-xs mt-2">
                          {new Date(req.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                          {req.assignedToAdmin && <span className="ml-3">· Asesor: {req.assignedToAdmin.name}</span>}
                        </p>
                      </div>
                      <Link
                        to={`/client/request/${req._id}`}
                        className="btn-ghost text-sm px-4 py-2 shrink-0 border border-slate-200 inline-flex items-center gap-1.5"
                      >
                        Ver detalles
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div className="bg-white rounded-2xl shadow-card p-12 text-center">
                <p className="text-gray-500">No hay solicitudes con este filtro</p>
              </div>
            )}
          </>
        )}
        {/* ── Sección: Tu Opinión ── */}
        <div className="mt-10 animate-slideUp">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1 h-7 bg-gradient-to-b from-secondary to-primary rounded-full"></div>
            <h2 className="text-xl font-black text-gray-900">Tu Opinión</h2>
          </div>

          {testimonialLoading ? (
            <div className="bg-white rounded-2xl shadow-card p-8 flex justify-center">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : myTestimonial ? (
            /* ── Ya existe una opinión ── */
            <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
              <div className="h-1 w-full bg-gradient-to-r from-primary to-secondary"></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                  <span className="text-sm font-semibold text-gray-500">Mi opinión enviada</span>
                  {(() => {
                    const cfg = TESTIMONIAL_STATUS[myTestimonial.status] || TESTIMONIAL_STATUS.pending;
                    return (
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${cfg.bg} ${cfg.text}`}>
                        <span>{cfg.icon}</span> {cfg.label}
                      </span>
                    );
                  })()}
                </div>
                <StarRating value={myTestimonial.rating} readOnly />
                <p className="mt-4 text-gray-700 leading-relaxed italic border-l-4 border-slate-200 pl-4">
                  "{myTestimonial.text}"
                </p>
                {myTestimonial.status === 'rejected' && (
                  <div className="mt-4 p-3 bg-red-50 rounded-xl border border-red-100">
                    <p className="text-xs text-red-600 font-medium">
                      Tu opinión no fue aprobada. Si deseas, puedes contactar al equipo para más información.
                    </p>
                  </div>
                )}
                {myTestimonial.status === 'pending' && (
                  <p className="mt-4 text-xs text-gray-400">
                    Nuestro equipo revisará tu opinión y la publicará pronto. ¡Gracias por tu confianza!
                  </p>
                )}
              </div>
            </div>
          ) : (
            /* ── Formulario de nueva opinión ── */
            <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
              <div className="h-1 w-full bg-gradient-to-r from-secondary to-primary"></div>
              <form onSubmit={handleTestimonialSubmit} className="p-6 space-y-6">
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg shrink-0"
                    style={{ background: 'linear-gradient(135deg, #1e3a8a, #06b6d4)' }}
                  >
                    {user?.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-500">Comparte tu experiencia con JEVANICK</p>
                  </div>
                </div>

                {/* Calificación con estrellas */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Calificación</label>
                  <StarRating value={testimonialRating} onChange={setTestimonialRating} />
                  <p className="text-xs text-gray-400 mt-1">
                    {testimonialRating === 1 && 'Muy malo'}
                    {testimonialRating === 2 && 'Malo'}
                    {testimonialRating === 3 && 'Regular'}
                    {testimonialRating === 4 && 'Bueno'}
                    {testimonialRating === 5 && 'Excelente'}
                  </p>
                </div>

                {/* Texto de la opinión */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tu opinión</label>
                  <textarea
                    value={testimonialText}
                    onChange={e => setTestimonialText(e.target.value)}
                    maxLength={500}
                    rows={4}
                    placeholder="Cuéntanos cómo fue tu experiencia con nuestros servicios de asesoría..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-gray-800 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-400">Mínimo 10 caracteres</p>
                    <p className={`text-xs font-medium ${testimonialText.length > 480 ? 'text-red-500' : 'text-gray-400'}`}>
                      {testimonialText.length}/500
                    </p>
                  </div>
                </div>

                {testimonialError  && <AlertBox type="error"   message={testimonialError} />}
                {testimonialSuccess && <AlertBox type="success" message={testimonialSuccess} />}

                <button
                  type="submit"
                  disabled={testimonialSaving || testimonialText.trim().length < 10}
                  className="btn-primary w-full py-3 font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {testimonialSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Enviar Mi Opinión
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
