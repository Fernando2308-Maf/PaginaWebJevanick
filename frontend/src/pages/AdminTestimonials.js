import React, { useState, useEffect } from 'react';
import { testimonialService } from '../services/api';
import { LoadingSpinner, AlertBox } from '../components/UI';

const STATUS_CFG = {
  pending:  { label: 'En revisión', bg: 'bg-amber-100',   text: 'text-amber-700',   bar: 'bg-amber-400',   icon: '⏳' },
  approved: { label: 'Aprobado',    bg: 'bg-emerald-100', text: 'text-emerald-700', bar: 'bg-emerald-500', icon: '✅' },
  rejected: { label: 'Rechazado',   bg: 'bg-red-100',     text: 'text-red-700',     bar: 'bg-red-500',     icon: '❌' },
};

const StarDisplay = ({ value }) => (
  <span className="text-sm tracking-tight">
    {[1,2,3,4,5].map(s => (
      <span key={s} style={{ filter: s <= value ? 'none' : 'grayscale(1) opacity(0.3)' }}>⭐</span>
    ))}
  </span>
);

export const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [filter, setFilter]             = useState('all');
  const [updating, setUpdating]         = useState(null); // id being updated

  useEffect(() => {
    testimonialService.getAll()
      .then(res => setTestimonials(res.data.testimonials))
      .catch(() => setError('Error al cargar los testimonios'))
      .finally(() => setLoading(false));
  }, []);

  const handleStatus = async (id, status) => {
    setUpdating(id);
    try {
      const res = await testimonialService.updateStatus(id, status);
      setTestimonials(prev =>
        prev.map(t => t._id === id ? res.data.testimonial : t)
      );
    } catch {
      setError('Error al actualizar el estado');
    } finally {
      setUpdating(null);
    }
  };

  const filtered = filter === 'all'
    ? testimonials
    : testimonials.filter(t => t.status === filter);

  const counts = {
    all:      testimonials.length,
    pending:  testimonials.filter(t => t.status === 'pending').length,
    approved: testimonials.filter(t => t.status === 'approved').length,
    rejected: testimonials.filter(t => t.status === 'rejected').length,
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="dash-page animate-fadeIn">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Header ── */}
        <div className="mb-8 animate-slideUp">
          <p className="text-sm text-gray-500 font-medium mb-1">Panel de Administración</p>
          <h1 className="text-3xl font-black gradient-text">Gestión de Opiniones</h1>
          <p className="text-gray-500 text-sm mt-1">Revisa y aprueba las opiniones enviadas por los clientes</p>
        </div>

        {error && <AlertBox type="error" message={error} />}

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total',       value: counts.all,      icon: '💬', color: 'from-slate-400 to-slate-500' },
            { label: 'Pendientes',  value: counts.pending,  icon: '⏳', color: 'from-amber-400 to-amber-500' },
            { label: 'Aprobadas',   value: counts.approved, icon: '✅', color: 'from-emerald-500 to-emerald-600' },
            { label: 'Rechazadas',  value: counts.rejected, icon: '❌', color: 'from-red-500 to-red-600' },
          ].map((s, i) => (
            <div key={i} className="card-stat animate-fadeIn" style={{ animationDelay: `${i * 60}ms` }}>
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

        {/* ── Filter tabs ── */}
        <div className="flex gap-2 flex-wrap mb-6 animate-slideUp">
          {[
            { key: 'all',      label: 'Todas' },
            { key: 'pending',  label: 'Pendientes' },
            { key: 'approved', label: 'Aprobadas' },
            { key: 'rejected', label: 'Rechazadas' },
          ].map(f => (
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
              <span className={`ml-1.5 text-xs font-bold px-1.5 py-0.5 rounded-md ${filter === f.key ? 'bg-white/20' : 'bg-slate-100 text-gray-500'}`}>
                {counts[f.key]}
              </span>
            </button>
          ))}
        </div>

        {/* ── List ── */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-card p-14 text-center animate-slideUp">
            <div className="text-5xl mb-4">💬</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Sin opiniones</h3>
            <p className="text-gray-500 text-sm">No hay opiniones con este filtro</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((t, idx) => {
              const cfg = STATUS_CFG[t.status] || STATUS_CFG.pending;
              const isUpdating = updating === t._id;
              return (
                <div
                  key={t._id}
                  className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden animate-slideUp"
                  style={{ animationDelay: `${idx * 40}ms` }}
                >
                  <div className={`h-1 w-full ${cfg.bar}`}></div>
                  <div className="p-5">
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-base shrink-0"
                          style={{ background: 'linear-gradient(135deg, #1e3a8a, #06b6d4)' }}
                        >
                          {t.clientName?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{t.clientName}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(t.createdAt).toLocaleDateString('es-ES', { year:'numeric', month:'long', day:'numeric' })}
                          </p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${cfg.bg} ${cfg.text}`}>
                        {cfg.icon} {cfg.label}
                      </span>
                    </div>

                    {/* Stars + text */}
                    <StarDisplay value={t.rating} />
                    <p className="mt-2 text-gray-700 text-sm leading-relaxed italic border-l-4 border-slate-200 pl-4">
                      "{t.text}"
                    </p>

                    {/* Action buttons */}
                    {t.status !== 'approved' && (
                      <div className="mt-4 flex gap-2 flex-wrap">
                        <button
                          onClick={() => handleStatus(t._id, 'approved')}
                          disabled={isUpdating}
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-all duration-200 flex items-center gap-1.5 disabled:opacity-60"
                        >
                          {isUpdating ? (
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : '✅'}
                          Aprobar
                        </button>
                        {t.status !== 'rejected' && (
                          <button
                            onClick={() => handleStatus(t._id, 'rejected')}
                            disabled={isUpdating}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl transition-all duration-200 flex items-center gap-1.5 disabled:opacity-60"
                          >
                            {isUpdating ? (
                              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : '❌'}
                            Rechazar
                          </button>
                        )}
                      </div>
                    )}
                    {t.status === 'approved' && (
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => handleStatus(t._id, 'pending')}
                          disabled={isUpdating}
                          className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-white text-xs font-bold rounded-xl transition-all duration-200 flex items-center gap-1.5 disabled:opacity-60"
                        >
                          {isUpdating ? (
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : '⏳'}
                          Poner en revisión
                        </button>
                        <button
                          onClick={() => handleStatus(t._id, 'rejected')}
                          disabled={isUpdating}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl transition-all duration-200 flex items-center gap-1.5 disabled:opacity-60"
                        >
                          ❌ Rechazar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
