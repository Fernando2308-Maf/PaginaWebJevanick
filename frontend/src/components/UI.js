import React from 'react';

export const LoadingSpinner = ({ text = 'Cargando...' }) => (
  <div className="flex flex-col justify-center items-center h-64 gap-4">
    <div className="relative">
      <div className="w-12 h-12 rounded-full border-4 border-slate-100"></div>
      <div
        className="absolute inset-0 w-12 h-12 rounded-full border-4 border-transparent border-t-secondary animate-spin"
      ></div>
    </div>
    <p className="text-gray-400 text-sm font-medium">{text}</p>
  </div>
);

export const AlertBox = ({ type = 'info', message, onClose }) => {
  const styles = {
    success: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', icon: '✓', iconBg: 'bg-emerald-100 text-emerald-600' },
    error:   { bg: 'bg-red-50',     border: 'border-red-200',     text: 'text-red-800',     icon: '✕', iconBg: 'bg-red-100 text-red-600' },
    warning: { bg: 'bg-amber-50',   border: 'border-amber-200',   text: 'text-amber-800',   icon: '!', iconBg: 'bg-amber-100 text-amber-600' },
    info:    { bg: 'bg-blue-50',    border: 'border-blue-200',    text: 'text-blue-800',    icon: 'i', iconBg: 'bg-blue-100 text-blue-600' },
  };
  const s = styles[type] || styles.info;

  return (
    <div className={`flex items-start gap-3 p-4 mb-4 rounded-xl border ${s.bg} ${s.border} animate-slideUp`}>
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5 ${s.iconBg}`}>
        {s.icon}
      </div>
      <p className={`flex-1 text-sm font-medium ${s.text}`}>{message}</p>
      {onClose && (
        <button onClick={onClose} className={`${s.text} opacity-60 hover:opacity-100 transition text-lg leading-none`}>
          ×
        </button>
      )}
    </div>
  );
};

export const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-card p-6 ${className}`}>
    {children}
  </div>
);

export const PageHeader = ({ title, subtitle, action }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-slideUp">
    <div>
      <h1 className="text-3xl font-black gradient-text">{title}</h1>
      {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

export const StatCard = ({ icon, label, value, color = 'from-blue-500 to-blue-600', trend }) => (
  <div className="card-stat">
    <div className={`bg-gradient-to-br ${color} w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-md shrink-0`}>
      {icon}
    </div>
    <div>
      <p className="text-gray-500 text-sm font-medium">{label}</p>
      <p className="text-2xl font-black text-gray-900 mt-0.5">{value}</p>
      {trend && <p className="text-xs text-emerald-600 font-semibold mt-1">{trend}</p>}
    </div>
  </div>
);
