import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../services/api';
import { LoadingSpinner, AlertBox } from '../components/UI';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminService.getDashboardStats()
      .then(res => setStats(res.data.stats))
      .catch(() => setError('Error al cargar estadísticas'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const statCards = stats ? [
    { label: 'Usuarios Totales', value: stats.totalUsers,        icon: '👥', color: 'from-blue-500 to-blue-700',    glow: 'rgba(59,130,246,0.3)' },
    { label: 'Solicitudes',      value: stats.totalRequests,      icon: '📋', color: 'from-cyan-500 to-cyan-700',    glow: 'rgba(6,182,212,0.3)' },
    { label: 'Pendientes',       value: stats.pendingRequests,    icon: '⏳', color: 'from-amber-400 to-orange-500', glow: 'rgba(245,158,11,0.3)' },
    { label: 'Completadas',      value: stats.completedRequests,  icon: '✅', color: 'from-emerald-500 to-emerald-700', glow: 'rgba(16,185,129,0.3)' },
  ] : [];

  return (
    <div className="dash-page animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Header ── */}
        <div className="mb-8 animate-slideUp">
          <p className="text-sm text-gray-500 font-medium mb-1">Panel de Administración</p>
          <h1 className="text-3xl font-black gradient-text">Dashboard</h1>
        </div>

        {error && <AlertBox type="error" message={error} />}

        {/* ── Stat cards ── */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {statCards.map((s, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 shadow-card border border-slate-100 hover:shadow-card-hover transition-all duration-300 animate-fadeIn"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`bg-gradient-to-br ${s.color} w-12 h-12 rounded-xl flex items-center justify-center text-2xl`}
                    style={{ boxShadow: `0 4px 16px ${s.glow}` }}
                  >
                    {s.icon}
                  </div>
                </div>
                <p className="text-gray-500 text-sm font-medium">{s.label}</p>
                <p className="text-3xl font-black text-gray-900 mt-1">{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Main grid ── */}
        <div className="grid lg:grid-cols-3 gap-6 animate-slideUp">

          {/* Quick Actions */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-card border border-slate-100 p-6">
            <h2 className="text-lg font-black text-gray-900 mb-5">Acciones Rápidas</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { icon: '👥', label: 'Usuarios',    desc: 'Gestionar cuentas',  to: '/admin/users',         color: 'from-blue-500 to-blue-700' },
                { icon: '📋', label: 'Solicitudes', desc: 'Ver asesorías',      to: '/admin/requests',      color: 'from-cyan-500 to-cyan-700' },
                { icon: '💬', label: 'Opiniones',   desc: 'Aprobar testimonios', to: '/admin/testimonials',  color: 'from-violet-500 to-purple-700' },
              ].map((a, i) => (
                <Link
                  key={i}
                  to={a.to}
                  className="group p-4 rounded-xl border border-slate-100 hover:border-secondary/30 hover:shadow-card-hover transition-all duration-300 flex flex-col gap-3"
                >
                  <div className={`bg-gradient-to-br ${a.color} w-11 h-11 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                    {a.icon}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{a.label}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{a.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* System status */}
          <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6">
            <h2 className="text-lg font-black text-gray-900 mb-5">Estado del Sistema</h2>
            <div className="space-y-4">
              {[
                { icon: '🟢', label: 'Servidor API',    status: 'Operativo' },
                { icon: '🟢', label: 'Base de Datos',   status: 'Conectada' },
                { icon: '🟢', label: 'Autenticación',   status: 'Activa' },
                { icon: '🟢', label: 'Almacenamiento',  status: 'Disponible' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{item.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">{item.status}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)' }}>
              <p className="text-xs text-gray-500 font-medium mb-1">Satisfacción General</p>
              <p className="text-2xl font-black text-emerald-600">95%</p>
              <div className="mt-2 h-1.5 bg-emerald-100 rounded-full">
                <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full" style={{ width: '95%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Capacidades ── */}
        <div className="mt-6 bg-white rounded-2xl shadow-card border border-slate-100 p-6 animate-slideUp">
          <h2 className="text-lg font-black text-gray-900 mb-5">Funciones Disponibles</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { icon: '📊', text: 'Monitorea solicitudes en tiempo real' },
              { icon: '👤', text: 'Administra perfiles de usuarios' },
              { icon: '📚', text: 'Comparte recursos y materiales' },
              { icon: '📈', text: 'Analiza métricas del sistema' },
              { icon: '💬', text: 'Proporciona retroalimentación' },
              { icon: '⚙️', text: 'Configura parámetros de la plataforma' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                <span className="text-xl shrink-0">{item.icon}</span>
                <span className="text-sm text-gray-700 font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
