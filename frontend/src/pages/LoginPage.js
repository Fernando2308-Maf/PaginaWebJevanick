import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { authService } from '../services/api';
import { AlertBox } from '../components/UI';
import logo from '../assets/logo.png';

export const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authService.login(formData.email, formData.password);
      login(res.data.user, res.data.token);
      navigate(res.data.user.role === 'admin' ? '/admin/dashboard' : '/client/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex animate-fadeIn">

      {/* ── Left: Dark brand panel ── */}
      <div
        className="hidden lg:flex lg:w-5/12 relative overflow-hidden flex-col items-center justify-center p-12"
        style={{ background: 'linear-gradient(145deg, #050d1a 0%, #0a1e40 55%, #071425 100%)' }}
      >
        <div className="orb orb-cyan" style={{ opacity: 0.45 }}></div>
        <div className="orb orb-blue" style={{ opacity: 0.3 }}></div>

        <div className="relative flex flex-col items-center text-center">
          <img
            src={logo}
            alt="JEVANICK"
            className="w-28 h-28 object-contain mb-6 animate-float drop-shadow-2xl"
          />
          <h1 className="text-4xl font-black text-white mb-2">JEVANICK</h1>
          <p className="text-secondary text-base font-medium mb-12">Crea tu futuro profesional</p>

          <div className="space-y-3 w-full max-w-xs">
            {[
              { icon: '📄', text: 'Optimiza tu currículum' },
              { icon: '🎯', text: 'Prepárate para entrevistas' },
              { icon: '💼', text: 'Construye tu perfil' },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-white/65 font-medium text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: White form ── */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <img src={logo} alt="JEVANICK" className="w-16 h-16 object-contain mx-auto mb-2" />
            <h2 className="text-2xl font-black gradient-text">JEVANICK</h2>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-900 mb-2">Bienvenido de vuelta</h2>
            <p className="text-gray-500">Ingresa tus credenciales para continuar</p>
          </div>

          {error && <AlertBox type="error" message={error} />}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Correo Electrónico</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="tu@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Contraseña</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" className="w-4 h-4 rounded accent-secondary" />
                <span className="text-sm text-gray-600">Recuérdame</span>
              </label>
              <a href="#" className="text-sm font-semibold text-secondary hover:text-secondary-dark transition">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary text-base font-bold py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="divider mt-6 mb-6">
            <span className="text-xs text-gray-400 font-semibold">O</span>
          </div>

          <p className="text-center text-gray-600 text-sm">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="font-bold text-secondary hover:text-secondary-dark transition">
              Regístrate gratis
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};
