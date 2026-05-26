import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/logo.png';

export const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const navLinks = user?.role === 'admin'
    ? [
        { to: '/admin/dashboard', label: 'Dashboard' },
        { to: '/admin/users', label: 'Usuarios' },
        { to: '/admin/requests', label: 'Solicitudes' },
        { to: '/admin/testimonials', label: 'Opiniones' },
      ]
    : user?.role === 'client'
    ? [
        { to: '/client/dashboard', label: 'Mis Asesorías' },
        { to: '/client/new-request', label: 'Nueva Solicitud' },
      ]
    : [];

  const isActive = (path) => location.pathname === path;
  const initials = user?.name?.charAt(0).toUpperCase() || '?';

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: 'rgba(5,13,26,0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div style={{ width: '44px', height: '34px', overflow: 'hidden', flexShrink: 0 }}>
              <img
                src={logo}
                alt="JEVANICK"
                className="group-hover:scale-110 transition-transform duration-300 drop-shadow-lg"
                style={{ width: '44px', height: 'auto', marginTop: '-1px' }}
              />
            </div>
            <div className="hidden sm:block leading-tight">
              <span className="block text-lg font-black text-white tracking-tight">JEVANICK</span>
              <span className="block text-xs text-secondary/70 font-medium">Crea tu futuro profesional</span>
            </div>
          </Link>

          {/* ── Desktop nav ── */}
          {user && (
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive(link.to)
                      ? 'bg-secondary/15 text-secondary'
                      : 'text-white/60 hover:text-white hover:bg-white/8'
                  }`}
                  style={isActive(link.to) ? {} : {}}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          {/* ── Right actions ── */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                {/* Desktop user info */}
                <div className="hidden sm:flex items-center gap-3">
                  <div className="hidden md:block text-right">
                    <p className="text-white text-sm font-bold leading-none">{user.name}</p>
                    <p className="text-secondary/60 text-xs mt-0.5">
                      {user.role === 'admin' ? 'Administrador' : 'Cliente'}
                    </p>
                  </div>
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-glow shrink-0"
                    style={{ background: 'linear-gradient(135deg, #06b6d4, #1e3a8a)' }}
                  >
                    {initials}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-semibold text-white/50 hover:text-red-400 px-3 py-2 rounded-lg hover:bg-red-500/10 transition-all duration-200"
                  >
                    Salir
                  </button>
                </div>

                {/* Mobile burger */}
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg bg-white/8 text-white hover:bg-white/15 transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {mobileOpen
                      ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    }
                  </svg>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="hidden sm:block text-sm font-semibold text-white/60 hover:text-white px-4 py-2 rounded-lg hover:bg-white/8 transition-all duration-200"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-bold text-white px-4 py-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 shadow-glow"
                  style={{ background: 'linear-gradient(135deg, #06b6d4, #1e3a8a)' }}
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ── Mobile menu ── */}
        {mobileOpen && user && (
          <div className="lg:hidden pb-4 border-t animate-fadeIn" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
            <div
              className="flex items-center gap-3 my-3 p-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-glow shrink-0"
                style={{ background: 'linear-gradient(135deg, #06b6d4, #1e3a8a)' }}
              >
                {initials}
              </div>
              <div>
                <p className="text-white font-bold text-sm">{user.name}</p>
                <p className="text-secondary/60 text-xs">{user.role === 'admin' ? 'Administrador' : 'Cliente'}</p>
              </div>
            </div>

            <nav className="flex flex-col gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    isActive(link.to) ? 'bg-secondary/15 text-secondary' : 'text-white/60 hover:text-white hover:bg-white/8'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="mt-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-red-400 hover:bg-red-500/10 text-left transition"
              >
                Cerrar Sesión
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
