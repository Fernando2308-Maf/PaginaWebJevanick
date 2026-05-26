import React, { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import { LoadingSpinner, AlertBox } from '../components/UI';

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

export const AdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [updateData, setUpdateData] = useState({});
  const [saving, setSaving] = useState(false);

  const loadRequests = async () => {
    try {
      const filter = statusFilter === 'all' ? undefined : statusFilter;
      const res = await adminService.getAllRequests(filter);
      setRequests(res.data.requests);
    } catch {
      setError('Error al cargar las solicitudes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRequests(); }, [statusFilter]); // eslint-disable-line

  const handleUpdateStatus = async () => {
    if (!selectedRequest) return;
    setSaving(true);
    try {
      await adminService.updateRequestStatus(selectedRequest._id, updateData);
      await loadRequests();
      setSelectedRequest(null);
      setUpdateData({});
    } catch {
      setError('Error al actualizar la solicitud');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="dash-page animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Header ── */}
        <div className="mb-8 animate-slideUp">
          <p className="text-sm text-gray-500 font-medium mb-1">Administración</p>
          <h1 className="text-3xl font-black gradient-text">Gestionar Solicitudes</h1>
        </div>

        {error && <AlertBox type="error" message={error} />}

        {/* ── Filters ── */}
        <div className="flex gap-2 flex-wrap mb-6 animate-slideUp">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                statusFilter === f.key
                  ? 'bg-primary text-white shadow-glow-primary'
                  : 'bg-white text-gray-600 shadow-card hover:shadow-card-hover border border-slate-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* ── List ── */}
        <div className="space-y-3">
          {requests.map((req, idx) => {
            const cfg = STATUS_CONFIG[req.status] || STATUS_CONFIG.pending;
            return (
              <div
                key={req._id}
                className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden group hover:shadow-card-hover cursor-pointer transition-all duration-300 animate-slideUp"
                style={{ animationDelay: `${idx * 40}ms` }}
                onClick={() => {
                  setSelectedRequest(req);
                  setUpdateData({ status: req.status, feedback: req.feedback || '' });
                }}
              >
                <div className={`h-1 w-full ${cfg.bar}`}></div>
                <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className={`badge ${cfg.badge} text-xs`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
                        {cfg.label}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 truncate group-hover:text-primary transition-colors">
                      {req.title}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-1">{req.description}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                      <span className="text-gray-400 text-xs font-medium">{req.clientId?.name}</span>
                      <span className="text-gray-400 text-xs">{req.clientId?.email}</span>
                      <span className="text-gray-400 text-xs">
                        {new Date(req.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-secondary/10 group-hover:text-secondary transition-all duration-200">
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {requests.length === 0 && (
          <div className="bg-white rounded-2xl shadow-card p-12 text-center">
            <p className="text-gray-500">No hay solicitudes con este filtro</p>
          </div>
        )}
      </div>

      {/* ══ Modal ══ */}
      {selectedRequest && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4 z-50 animate-fadeIn"
          style={{ background: 'rgba(5,13,26,0.75)', backdropFilter: 'blur(8px)' }}
          onClick={(e) => e.target === e.currentTarget && setSelectedRequest(null)}
        >
          <div className="bg-white rounded-2xl shadow-modal w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slideUp">

            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-black gradient-text">Actualizar Solicitud</h2>
                <p className="text-gray-500 text-sm mt-0.5">{selectedRequest.title}</p>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-gray-500 hover:bg-slate-200 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Client info */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">Solicitante</p>
                <p className="font-bold text-gray-900">{selectedRequest.clientId?.name}</p>
                <p className="text-sm text-gray-500 mt-0.5">{selectedRequest.clientId?.email}</p>
              </div>

              {/* Status selection */}
              <div>
                <p className="text-sm font-bold text-gray-700 mb-3">Cambiar Estado</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                    <label key={key} className="cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value={key}
                        checked={updateData.status === key}
                        onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
                        className="sr-only"
                      />
                      <div className={`p-3 rounded-xl border-2 transition-all text-center font-semibold text-sm ${
                        updateData.status === key
                          ? 'border-secondary bg-secondary/5 text-secondary'
                          : 'border-slate-200 bg-white text-gray-600 hover:border-slate-300'
                      }`}>
                        <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${cfg.dot}`}></span>
                        {cfg.label}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Feedback */}
              <div>
                <p className="text-sm font-bold text-gray-700 mb-2">Retroalimentación</p>
                <textarea
                  value={updateData.feedback || ''}
                  onChange={(e) => setUpdateData({ ...updateData, feedback: e.target.value })}
                  rows={4}
                  className="input-field resize-none"
                  placeholder="Escribe tu retroalimentación para el cliente..."
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleUpdateStatus}
                  disabled={saving}
                  className="flex-1 btn-primary text-sm font-bold py-3 disabled:opacity-50"
                >
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
                <button
                  onClick={() => { setSelectedRequest(null); setUpdateData({}); }}
                  className="flex-1 btn-ghost text-sm font-semibold py-3 border border-slate-200"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
