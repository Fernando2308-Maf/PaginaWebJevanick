# JEVANICK - Proyecto Integrador

## 📋 Información del Proyecto

- **Nombre**: JEVANICK - Plataforma de Asesorías Profesionales
- **Objetivo**: Sistema web para brindar asesorías laborales personalizadas
- **Stack**: MERN (MongoDB, Express, React, Node.js)
- **Roles**: Admin y Cliente

## 🎯 Funcionalidades Principales

### Panel de Cliente
- Crear solicitudes de asesoría
- Ver estado de solicitudes
- Acceder a recursos educativos
- Monitorear feedback del administrador

### Panel de Administrador
- Dashboard con estadísticas
- Gestionar usuarios (crear, editar, eliminar)
- Revisar y actualizar solicitudes
- Proporcionar feedback a clientes
- Gestionar recursos educativos

## 📂 Estructura del Proyecto

```
jevanick-platform/
├── backend/          # API REST (Express + MongoDB)
├── frontend/         # Interfaz web (React + Tailwind)
├── README.md         # Documentación completa
├── QUICK_START.md    # Guía rápida
└── PROJECT_INFO.md   # Este archivo
```

## 🔑 Variables de Entorno

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/jevanick
JWT_SECRET=tu_clave_secreta
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 📊 Modelos de Base de Datos

### User
- name, email, password, phone
- role: admin | client
- status: active | inactive | suspended
- timestamps

### AdvisoryRequest
- clientId, title, description
- status: pending | in_progress | completed | rejected
- priority: low | medium | high
- assignedToAdmin, feedback
- attachments, timestamps

### Resource
- title, description, category
- fileUrl, videoUrl
- createdBy, isPublic
- timestamps

## 🚀 Próximos Pasos

1. Instalar MongoDB si no lo tienes
2. Ejecutar `npm install` en backend y frontend
3. Configurar variables de entorno
4. Iniciar MongoDB, backend, y frontend
5. Registrar usuarios de prueba

## 📞 Contacto y Soporte

**Institución**: Instituto Tecnológico Superior de Guasave
**Programa**: Ingeniería en Gestión Empresarial
**Cliente**: Jefatura de División de Ciencias Industriales
