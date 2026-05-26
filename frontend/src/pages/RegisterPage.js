import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { AlertBox } from '../components/UI';
import logo from '../assets/logo.png';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.register(formData.name, formData.email, formData.password, formData.phone);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex animate-fadeIn">

      {/* ── Left: White form ── */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <img src={logo} alt="JEVANICK" className="w-16 h-16 object-contain mx-auto mb-2" />
            <h2 className="text-2xl font-black gradient-text">JEVANICK</h2>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-900 mb-2">Crea tu cuenta</h2>
            <p className="text-gray-500">Únete a la plataforma de asesorías profesionales</p>
          </div>

          {error && <AlertBox type="error" message={error} />}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Nombre Completo</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="Tu nombre completo"
                required
              />
            </div>
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
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Teléfono <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-field"
                placeholder="+52 667 123 4567"
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
                placeholder="Mínimo 6 caracteres"
                minLength="6"
                required
              />
            </div>

            <label className="flex items-start gap-3 cursor-pointer pt-1 select-none">
              <input type="checkbox" className="w-4 h-4 mt-0.5 rounded accent-secondary shrink-0" required />
              <span className="text-sm text-gray-600">
                Acepto los{' '}
                <a href="#" className="text-secondary font-semibold hover:underline">términos y condiciones</a>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary text-base font-bold py-3.5 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creando cuenta...' : 'Crear Cuenta Gratis'}
            </button>
          </form>

          <div className="divider mt-6 mb-6">
            <span className="text-xs text-gray-400 font-semibold">O</span>
          </div>

          <p className="text-center text-gray-600 text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="font-bold text-secondary hover:text-secondary-dark transition">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>

      {/* ── Right: Dark brand panel ── */}
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
          <h1 className="text-4xl font-black text-white mb-2">¡Únete Hoy!</h1>
          <p className="text-white/55 text-base mb-12 max-w-xs">
            Comienza tu camino hacia una carrera profesional exitosa
          </p>

          <div className="space-y-3 w-full max-w-xs">
            {[
              { icon: '✨', title: 'Asesorías Personalizadas', desc: 'Orientación adaptada a ti' },
              { icon: '📈', title: 'Mejora tu Perfil', desc: 'Presencia profesional optimizada' },
              { icon: '🎯', title: 'Alcanza tus Metas', desc: 'Preparación para el éxito' },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <span className="text-xl shrink-0">{item.icon}</span>
                <div className="text-left">
                  <p className="text-white font-semibold text-sm leading-none">{item.title}</p>
                  <p className="text-white/40 text-xs mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
