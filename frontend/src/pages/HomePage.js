import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { testimonialService } from '../services/api';
import logo from '../assets/logo.png';

const FAQS = [
  { q: '¿Cómo funciona el proceso de asesoría?', a: 'Creas una cuenta, envías tu solicitud describiendo lo que necesitas y un asesor profesional la revisa y te brinda retroalimentación personalizada.' },
  { q: '¿Cuánto tiempo tarda en responderme un asesor?', a: 'Nuestro equipo se compromete a dar respuesta en un plazo de 24 a 48 horas hábiles desde que recibes la solicitud.' },
  { q: '¿Puedo solicitar más de un servicio a la vez?', a: 'Sí, puedes crear múltiples solicitudes según tus necesidades. Cada una será atendida de forma independiente.' },
  { q: '¿Mis datos están seguros en la plataforma?', a: 'Absolutamente. Toda tu información está protegida y solo es accesible por ti y el asesor asignado a tu caso.' },
  { q: '¿El servicio es gratuito?', a: 'Contamos con distintas modalidades. Regístrate para conocer las opciones disponibles y encontrar la que mejor se adapte a ti.' },
];

const PLACEHOLDER_TESTIMONIALS = [
  { clientName: 'María G.', text: 'Gracias a JEVANICK mejoré mi currículum y conseguí mi primera entrevista formal. El asesor fue muy detallado y amable.', rating: 5 },
  { clientName: 'Carlos R.', text: 'Llevaba meses buscando trabajo sin respuesta. Después de optimizar mi CV con JEVANICK empecé a recibir llamadas en menos de dos semanas.', rating: 5 },
  { clientName: 'Ana L.', text: 'No sabía cómo presentarme sin experiencia. El equipo me ayudó a destacar mis habilidades y construir una carta de presentación impactante.', rating: 5 },
];

const SERVICES = [
  { icon: '📄', label: 'Elaboración de Currículum Vitae' },
  { icon: '✏️', label: 'Corrección y optimización de CV' },
  { icon: '💌', label: 'Creación de cartas de presentación' },
  { icon: '🎤', label: 'Preparación para entrevista de trabajo' },
  { icon: '🎓', label: 'Servicio para estudiantes o personas sin experiencia' },
  { icon: '📋', label: 'Plantillas y recursos profesionales' },
  { icon: '🔍', label: 'Seguimiento personalizado' },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden transition-all duration-300"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <span className="font-bold text-gray-900 text-sm pr-4">{q}</span>
        <span
          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 ${open ? 'bg-secondary text-white' : 'bg-slate-100 text-gray-500'}`}
        >
          <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${open ? 'rotate-45' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </span>
      </button>
      {open && (
        <div className="px-5 pb-5 animate-fadeIn">
          <p className="text-gray-500 text-sm leading-relaxed border-t border-slate-100 pt-4">{a}</p>
        </div>
      )}
    </div>
  );
}

export const HomePage = () => {
  const { user } = useContext(AuthContext);
  const [testimonials, setTestimonials] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    testimonialService.getApproved()
      .then(res => {
        const data = res.data.testimonials;
        setTestimonials(data.length > 0 ? data : PLACEHOLDER_TESTIMONIALS);
      })
      .catch(() => setTestimonials(PLACEHOLDER_TESTIMONIALS));
  }, []);

  // Auto-rotar cada 5 segundos
  useEffect(() => {
    if (testimonials.length <= 1) return;
    timerRef.current = setInterval(() => {
      setActiveIdx(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, [testimonials]);

  const goTo = (idx) => {
    clearInterval(timerRef.current);
    setActiveIdx(idx);
  };

  return (
    <div className="animate-fadeIn">

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="dark-page relative">
        <div className="orb orb-cyan"></div>
        <div className="orb orb-blue"></div>
        <div className="orb orb-orange"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left */}
            <div className="animate-slideUp">
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
                style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.22)' }}
              >
                <span className="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
                <span className="text-secondary text-sm font-semibold tracking-wide">Plataforma Profesional</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-[1.1] text-white">
                Crea tu<br />
                <span className="gradient-text-light">Futuro</span><br />
                <span style={{ color: 'rgba(255,255,255,0.88)' }}>Profesional</span>
              </h1>

              <p className="text-lg mb-10 leading-relaxed max-w-lg" style={{ color: 'rgba(255,255,255,0.55)' }}>
                JEVANICK te conecta con asesorías especializadas para optimizar tu currículum, construir tu perfil y triunfar en el mercado laboral.
              </p>

              {!user ? (
                <div className="flex gap-4 flex-wrap">
                  <Link to="/register" className="btn-secondary text-base px-8 py-4 font-bold inline-flex items-center gap-2 shadow-glow">
                    Comenzar Gratis
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  <Link
                    to="/login"
                    className="text-base px-8 py-4 font-semibold rounded-xl transition-all duration-200 inline-flex items-center gap-2"
                    style={{ color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.12)' }}
                  >
                    Iniciar Sesión
                  </Link>
                </div>
              ) : user.role === 'client' ? (
                <Link to="/client/dashboard" className="btn-secondary text-base px-8 py-4 font-bold inline-flex items-center gap-2 shadow-glow">
                  Ir al Dashboard
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              ) : (
                <Link to="/admin/dashboard" className="btn-secondary text-base px-8 py-4 font-bold inline-flex items-center gap-2 shadow-glow">
                  Panel de Admin
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              )}

              <div className="mt-10 flex items-center gap-6 flex-wrap">
                {['500+ Usuarios', '95% Satisfacción', 'Respuesta Rápida'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-secondary rounded-full"></span>
                    <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right cards */}
            <div className="hidden lg:block animate-slideInRight">
              <div className="relative">
                <div className="absolute inset-0 rounded-3xl" style={{ background: 'radial-gradient(ellipse at center, rgba(6,182,212,0.08) 0%, transparent 70%)' }}></div>
                <div className="relative space-y-4">
                  {[
                    { label: 'Optimización de Currículum', desc: 'Destaca frente a cientos de candidatos', icon: '📄', accent: 'rgba(59,91,219,0.25)', border: 'rgba(59,91,219,0.2)' },
                    { label: 'Preparación para Entrevistas', desc: 'Practica con casos y escenarios reales', icon: '🎯', accent: 'rgba(6,182,212,0.2)', border: 'rgba(6,182,212,0.2)' },
                    { label: 'Perfil Profesional', desc: 'Construye y potencia tu marca personal', icon: '💼', accent: 'rgba(20,184,166,0.2)', border: 'rgba(20,184,166,0.2)' },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="card-dark flex items-center gap-4 hover:shadow-glow"
                      style={{ background: `linear-gradient(135deg, ${item.accent}, rgba(13,32,64,0.7))`, borderColor: item.border }}
                    >
                      <div className="text-3xl shrink-0">{item.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-bold truncate">{item.label}</p>
                        <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{item.desc}</p>
                      </div>
                      <svg className="w-4 h-4 shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ QUIÉNES SOMOS ═══════════════ */}
      <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 50%, #14b8a6 100%)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 65%)', filter: 'blur(40px)' }}></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full" style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 65%)', filter: 'blur(40px)' }}></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* ── Columna izquierda: Logo ── */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">

              {/* Logo recortado — solo el emblema JV sin el texto inferior */}
              <div
                className="relative mb-8"
                style={{
                  width: '300px',
                  height: '228px',   /* muestra emblema + JEVANICK, oculta el subtítulo pequeño */
                  overflow: 'hidden',
                }}
              >
                {/* halo suave detrás */}
                <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 45%, rgba(255,255,255,0.1) 0%, transparent 70%)', filter: 'blur(18px)' }}></div>
                <img
                  src={logo}
                  alt="JEVANICK"
                  style={{
                    width: '300px',
                    height: 'auto',
                    marginTop: '-10px',
                    filter: 'drop-shadow(0 16px 48px rgba(0,0,0,0.5)) drop-shadow(0 0 60px rgba(6,182,212,0.3))',
                  }}
                />
              </div>

              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
                style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}
              >
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                <span className="text-white text-sm font-bold tracking-wide">Nuestra Historia</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">¿Quiénes<br />somos?</h2>
              <div className="w-16 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.4)' }}></div>
            </div>

            {/* ── Columna derecha: Información ── */}
            <div>
              <p className="text-white/90 text-lg leading-relaxed mb-6">
                <span className="font-black text-xl" style={{ color: '#67e8f9' }}>JEVANICK</span> es una empresa dedicada al asesoramiento profesional mediante servicios digitales enfocados en la elaboración de currículums, orientación laboral y apoyo en el desarrollo profesional de las personas.
              </p>
              <p className="text-base leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.72)' }}>
                Nuestro objetivo es brindar herramientas que permitan a los usuarios fortalecer su perfil laboral y mejorar sus oportunidades dentro del mercado de trabajo actual.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: '🎯', label: 'Misión', desc: 'Impulsar el desarrollo profesional de cada persona' },
                  { icon: '🌟', label: 'Visión', desc: 'Ser la plataforma de asesoría profesional líder en México' },
                  { icon: '💡', label: 'Valores', desc: 'Compromiso, honestidad e innovación en cada servicio' },
                  { icon: '🤝', label: 'Equipo', desc: 'Profesionales apasionados por el desarrollo humano' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)' }}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <p className="text-white font-bold mt-2 text-sm">{item.label}</p>
                    <p className="text-xs mt-1 leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════ SERVICIOS ═══════════════ */}
      <section className="py-24 bg-white dot-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="badge badge-secondary mb-4 text-sm px-4 py-1.5">Lo que ofrecemos</span>
            <h2 className="text-4xl md:text-5xl font-black mb-4 gradient-text">Nuestros Servicios</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Soluciones integrales diseñadas para impulsar tu desarrollo profesional
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Service list */}
            <div className="space-y-3">
              {SERVICES.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white shadow-card border border-slate-100 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 animate-slideUp"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                    style={{ background: 'linear-gradient(135deg, rgba(30,58,138,0.08), rgba(6,182,212,0.1))' }}
                  >
                    {s.icon}
                  </div>
                  <span className="font-semibold text-gray-800">{s.label}</span>
                  <svg className="w-4 h-4 text-secondary ml-auto shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              ))}
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '👥', title: 'Asesorías Personalizadas', desc: 'Orientación adaptada a tus objetivos específicos', color: 'bg-blue-500' },
                { icon: '📚', title: 'Recursos Exclusivos', desc: 'Guías, plantillas y materiales premium', color: 'bg-cyan-500' },
                { icon: '📊', title: 'Seguimiento en Vivo', desc: 'Monitorea el avance en tiempo real', color: 'bg-teal-500' },
                { icon: '🎓', title: 'Expertos Certificados', desc: 'Asesores con experiencia comprobada', color: 'bg-purple-500' },
              ].map((f, i) => (
                <div key={i} className="card-premium group hover:border-secondary/20">
                  <div className={`${f.color} w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    {f.icon}
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">{f.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ CÓMO FUNCIONA ═══════════════ */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="badge badge-primary mb-4 text-sm px-4 py-1.5">Proceso Simple</span>
            <h2 className="text-4xl md:text-5xl font-black gradient-text">¿Cómo Funciona?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { step: '01', title: 'Crea tu cuenta', desc: 'Regístrate en segundos y accede a todas las funciones de la plataforma', icon: '👤' },
              { step: '02', title: 'Envía tu solicitud', desc: 'Describe tu necesidad y nuestros asesores la recibirán inmediatamente', icon: '📝' },
              { step: '03', title: 'Recibe orientación', desc: 'Obtén retroalimentación personalizada y recursos de apoyo profesional', icon: '🚀' },
            ].map((s, i) => (
              <div key={i} className="relative text-center">
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-[58%] w-[84%] h-px" style={{ background: 'linear-gradient(90deg, #e2e8f0, transparent)' }}></div>
                )}
                <div className="inline-flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-glow-primary" style={{ background: 'linear-gradient(135deg, #1e3a8a, #06b6d4)' }}>
                    {s.icon}
                  </div>
                  <span className="text-xs font-black mb-2 tracking-widest" style={{ color: 'rgba(6,182,212,0.6)' }}>PASO {s.step}</span>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-xs">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ TESTIMONIOS — carrusel ═══════════════ */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="badge badge-success mb-4 text-sm px-4 py-1.5">Testimonios</span>
            <h2 className="text-4xl md:text-5xl font-black gradient-text mb-4">Lo que dicen nuestros usuarios</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">Experiencias reales de personas que transformaron su carrera con JEVANICK</p>
          </div>

          {testimonials.length > 0 && (
            <div className="relative">
              {/* Tarjeta activa */}
              <div
                key={activeIdx}
                className="card-premium flex flex-col gap-5 text-center animate-fadeIn mx-auto"
                style={{ maxWidth: '680px', minHeight: '220px' }}
              >
                {/* Estrellas */}
                <div className="flex gap-1 justify-center">
                  {Array.from({ length: testimonials[activeIdx].rating || 5 }).map((_, s) => (
                    <svg key={s} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Comillas decorativas */}
                <p className="text-gray-600 text-lg leading-relaxed italic flex-1">
                  <span className="text-4xl text-secondary/30 font-black leading-none">"</span>
                  {testimonials[activeIdx].text}
                  <span className="text-4xl text-secondary/30 font-black leading-none">"</span>
                </p>

                {/* Avatar + nombre */}
                <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-100">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0"
                    style={{ background: 'linear-gradient(135deg, #1e3a8a, #06b6d4)' }}
                  >
                    {(testimonials[activeIdx].clientName || '?').charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900 text-sm leading-none">{testimonials[activeIdx].clientName}</p>
                    <p className="text-gray-400 text-xs mt-0.5">Cliente JEVANICK</p>
                  </div>
                </div>
              </div>

              {/* Puntos de navegación */}
              {testimonials.length > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      className={`rounded-full transition-all duration-300 ${
                        i === activeIdx
                          ? 'w-8 h-2.5 bg-secondary'
                          : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Flechas */}
              {testimonials.length > 1 && (
                <>
                  <button
                    onClick={() => goTo((activeIdx - 1 + testimonials.length) % testimonials.length)}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-xl bg-white shadow-card hover:shadow-card-hover border border-slate-100 flex items-center justify-center text-gray-500 hover:text-primary transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => goTo((activeIdx + 1) % testimonials.length)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-xl bg-white shadow-card hover:shadow-card-hover border border-slate-100 flex items-center justify-center text-gray-500 hover:text-primary transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          )}

          {/* CTA para dejar opinión */}
          {user?.role === 'client' && (
            <div className="mt-10 text-center">
              <Link to="/client/dashboard" className="btn-ghost text-sm border border-slate-200 px-5 py-2.5 inline-flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Dejar mi opinión
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════ STATS ═══════════════ */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #050d1a 0%, #0d2040 50%, #071425 100%)' }}>
        <div className="orb orb-cyan" style={{ opacity: 0.35 }}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
            {[
              { n: '500+', l: 'Usuarios Activos' },
              { n: '1,000+', l: 'Solicitudes' },
              { n: '95%', l: 'Satisfacción' },
              { n: '50+', l: 'Recursos' },
            ].map((s, i) => (
              <div key={i}>
                <p className="text-4xl md:text-5xl font-black gradient-text-light mb-2">{s.n}</p>
                <p className="font-medium text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ PREGUNTAS FRECUENTES ═══════════════ */}
      <section className="py-24 bg-slate-50 dot-bg">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="badge badge-info mb-4 text-sm px-4 py-1.5">FAQ</span>
            <h2 className="text-4xl md:text-5xl font-black gradient-text mb-4">Preguntas Frecuentes</h2>
            <p className="text-gray-500 text-lg">Resolvemos tus dudas más comunes sobre JEVANICK</p>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      {/* ═══════════════ CONTACTO ═══════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="badge badge-secondary mb-4 text-sm px-4 py-1.5">Contacto</span>
            <h2 className="text-4xl md:text-5xl font-black gradient-text mb-4">¿Tienes alguna duda?</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">Estamos aquí para ayudarte. Escríbenos y te responderemos a la brevedad.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { icon: '📧', label: 'Email', value: 'info@jevanick.com', color: 'from-blue-500 to-blue-700' },
              { icon: '📞', label: 'Teléfono', value: '+52 667 123 4567', color: 'from-cyan-500 to-cyan-700' },
              { icon: '📍', label: 'Ubicación', value: 'Guasave, Sinaloa, México', color: 'from-teal-500 to-teal-700' },
            ].map((c, i) => (
              <div key={i} className="card-premium text-center hover:border-secondary/20">
                <div className={`bg-gradient-to-br ${c.color} w-12 h-12 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3 shadow-md`}>
                  {c.icon}
                </div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{c.label}</p>
                <p className="font-semibold text-gray-900 text-sm">{c.value}</p>
              </div>
            ))}
          </div>

          {/* Contact form placeholder */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 text-center">
            <p className="text-gray-400 text-sm font-medium mb-2">Formulario de contacto</p>
            <p className="text-gray-600 font-semibold">Próximamente disponible</p>
            <p className="text-gray-400 text-sm mt-1">Por ahora puedes contactarnos directamente por email o teléfono</p>
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      {!user && (
        <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e3a8a, #0891b2, #06b6d4)' }}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-white rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-white rounded-full filter blur-3xl"></div>
          </div>
          <div className="relative max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">¿Listo para transformar tu carrera?</h2>
            <p className="text-lg mb-10" style={{ color: 'rgba(255,255,255,0.7)' }}>Únete hoy y da el primer paso hacia tu futuro profesional</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/register" className="bg-white text-primary font-black px-10 py-4 rounded-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 inline-flex items-center gap-2">
                Comenzar Ahora
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link to="/login" className="font-bold px-10 py-4 rounded-xl hover:bg-white/10 transition-all inline-flex items-center gap-2 text-white" style={{ border: '2px solid rgba(255,255,255,0.4)' }}>
                Ya tengo cuenta
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer style={{ background: '#050d1a', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <img src={logo} alt="JEVANICK" className="h-9 w-9 object-contain" />
                <span className="text-white font-black text-lg">JEVANICK</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>Crea tu futuro profesional con asesorías de calidad.</p>
            </div>
            <div>
              <p className="text-white/75 font-bold mb-4 text-sm uppercase tracking-wide">Servicios</p>
              <ul className="space-y-2 text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
                <li><a href="#" className="hover:text-secondary transition">Elaboración de CV</a></li>
                <li><a href="#" className="hover:text-secondary transition">Preparación de entrevistas</a></li>
                <li><a href="#" className="hover:text-secondary transition">Perfil profesional</a></li>
              </ul>
            </div>
            <div>
              <p className="text-white/75 font-bold mb-4 text-sm uppercase tracking-wide">Empresa</p>
              <ul className="space-y-2 text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
                <li><a href="#" className="hover:text-secondary transition">¿Quiénes somos?</a></li>
                <li><a href="#" className="hover:text-secondary transition">Política de privacidad</a></li>
                <li><a href="#" className="hover:text-secondary transition">Términos y condiciones</a></li>
              </ul>
            </div>
            <div>
              <p className="text-white/75 font-bold mb-4 text-sm uppercase tracking-wide">Contacto</p>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>info@jevanick.com</p>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>+52 667 123 4567</p>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Guasave, Sinaloa, México</p>
            </div>
          </div>
          <div className="pt-6 text-center text-sm" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.25)' }}>
            © 2025 JEVANICK. Todos los derechos reservados. · <a href="#" className="hover:text-secondary transition">Política de Privacidad</a> · <a href="#" className="hover:text-secondary transition">Términos y Condiciones</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
