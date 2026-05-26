import React, { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import { LoadingSpinner, AlertBox } from '../components/UI';

const STATUS_CONFIG = {
  active:    { label: 'Activo',     badge: 'badge-success', dot: 'bg-emerald-500' },
  inactive:  { label: 'Inactivo',   badge: 'badge-warning', dot: 'bg-amber-400' },
  suspended: { label: 'Suspendido', badge: 'badge-danger',  dot: 'bg-red-500' },
};

const AVATAR_COLORS = [
  'from-blue-500 to-blue-700',
  'from-cyan-500 to-cyan-700',
  'from-teal-500 to-teal-700',
  'from-purple-500 to-purple-700',
  'from-pink-500 to-pink-700',
  'from-orange-500 to-orange-700',
];

function getAvatarColor(name = '') {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [roleFilter, setRoleFilter] = useState('client');
  const [selectedUser, setSelectedUser] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [saving, setSaving] = useState(false);

  const loadUsers = async () => {
    try {
      const res = await adminService.getAllUsers(roleFilter);
      setUsers(res.data.users);
    } catch {
      setError('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, [roleFilter]); // eslint-disable-line

  const handleStatusChange = async () => {
    if (!selectedUser || !newStatus) return;
    setSaving(true);
    try {
      await adminService.updateUserStatus(selectedUser._id, newStatus);
      await loadUsers();
      setSelectedUser(null);
      setNewStatus('');
    } catch {
      setError('Error al actualizar el usuario');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;
    try {
      await adminService.deleteUser(id);
      await loadUsers();
    } catch {
      setError('Error al eliminar el usuario');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="dash-page animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Header ── */}
        <div className="mb-8 animate-slideUp">
          <p className="text-sm text-gray-500 font-medium mb-1">Administración</p>
          <h1 className="text-3xl font-black gradient-text">Gestionar Usuarios</h1>
        </div>

        {error && <AlertBox type="error" message={error} />}

        {/* ── Role filter ── */}
        <div className="flex gap-2 mb-6 animate-slideUp">
          {[
            { value: 'client', label: 'Clientes' },
            { value: 'admin',  label: 'Administradores' },
          ].map(r => (
            <button
              key={r.value}
              onClick={() => setRoleFilter(r.value)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                roleFilter === r.value
                  ? 'bg-primary text-white shadow-glow-primary'
                  : 'bg-white text-gray-600 shadow-card hover:shadow-card-hover border border-slate-100'
              }`}
            >
              {r.label}
              <span className={`ml-2 text-xs font-bold px-1.5 py-0.5 rounded-md ${roleFilter === r.value ? 'bg-white/20' : 'bg-slate-100 text-gray-400'}`}>
                {users.length}
              </span>
            </button>
          ))}
        </div>

        {/* ── Users grid ── */}
        {users.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-card p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">👤</div>
            <p className="text-gray-500 font-medium">No hay usuarios en esta categoría</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {users.map((user, idx) => {
              const cfg = STATUS_CONFIG[user.status] || STATUS_CONFIG.active;
              const avatarColor = getAvatarColor(user.name);
              const initials = user.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';

              return (
                <div
                  key={user._id}
                  className="bg-white rounded-2xl shadow-card border border-slate-100 p-5 hover:shadow-card-hover transition-all duration-300 animate-slideUp"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`bg-gradient-to-br ${avatarColor} w-11 h-11 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md shrink-0`}>
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 text-sm truncate">{user.name}</p>
                        <p className="text-gray-500 text-xs truncate">{user.email}</p>
                      </div>
                    </div>
                    <span className={`badge ${cfg.badge} text-xs shrink-0`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
                      {cfg.label}
                    </span>
                  </div>

                  <p className="text-gray-400 text-xs mb-4">
                    Desde {new Date(user.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'short' })}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => { setSelectedUser(user); setNewStatus(user.status); }}
                      className="flex-1 text-sm font-semibold py-2 rounded-xl text-secondary hover:bg-secondary/8 border border-secondary/20 hover:border-secondary/40 transition-all duration-200"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="flex-1 text-sm font-semibold py-2 rounded-xl text-red-500 hover:bg-red-50 border border-red-100 hover:border-red-200 transition-all duration-200"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ══ Modal ══ */}
      {selectedUser && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4 z-50 animate-fadeIn"
          style={{ background: 'rgba(5,13,26,0.75)', backdropFilter: 'blur(8px)' }}
          onClick={(e) => e.target === e.currentTarget && setSelectedUser(null)}
        >
          <div className="bg-white rounded-2xl shadow-modal w-full max-w-sm animate-slideUp">

            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-black gradient-text">Editar Usuario</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-gray-500 hover:bg-slate-200 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* User info */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50">
                <div
                  className={`bg-gradient-to-br ${getAvatarColor(selectedUser.name)} w-11 h-11 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md shrink-0`}
                >
                  {selectedUser.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{selectedUser.name}</p>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                </div>
              </div>

              {/* Status selector */}
              <div>
                <p className="text-sm font-bold text-gray-700 mb-3">Estado de la Cuenta</p>
                <div className="space-y-2">
                  {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                    <label key={key} className="cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value={key}
                        checked={newStatus === key}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="sr-only"
                      />
                      <div className={`p-3 rounded-xl border-2 transition-all flex items-center gap-3 ${
                        newStatus === key
                          ? 'border-secondary bg-secondary/5'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}>
                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${cfg.dot}`}></span>
                        <span className={`font-semibold text-sm ${newStatus === key ? 'text-secondary' : 'text-gray-600'}`}>
                          {cfg.label}
                        </span>
                        {newStatus === key && (
                          <svg className="w-4 h-4 text-secondary ml-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  onClick={handleStatusChange}
                  disabled={saving}
                  className="flex-1 btn-primary text-sm font-bold py-3 disabled:opacity-50"
                >
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
                <button
                  onClick={() => setSelectedUser(null)}
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
