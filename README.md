# 🚀 JEVANICK - Plataforma de Asesorías Profesionales

Plataforma web integrada para gestión de asesorías profesionales, currículum y preparación laboral.

## 📋 Características

- ✅ **Dos Roles**: Admin y Cliente
- ✅ **Panel de Administrador**: Gestionar usuarios, solicitudes y recursos
- ✅ **Panel de Cliente**: Crear solicitudes, monitorear progreso
- ✅ **Sistema de Asesorías**: Curriculum, Carta de Presentación, Perfil Profesional, Entrevistas
- ✅ **Autenticación JWT**: Segura y eficiente
- ✅ **Diseño Responsivo**: Basado en la paleta de colores de JEVANICK
- ✅ **Base de Datos MongoDB**: Flexible y escalable

## 🛠️ Stack Tecnológico

### Backend
- **Node.js + Express**: Framework de servidor
- **MongoDB**: Base de datos NoSQL
- **JWT**: Autenticación
- **Bcrypt**: Encriptación de contraseñas

### Frontend
- **React 18**: Librería de interfaz
- **React Router**: Navegación
- **Tailwind CSS**: Estilos
- **Axios**: Cliente HTTP

## 📦 Instalación

### Prerequisitos
- Node.js (v14+)
- MongoDB (instalado y ejecutándose)
- npm o yarn

### 1. Clonar el repositorio
```bash
cd jevanick-platform
```

### 2. Instalar Backend
```bash
cd backend
npm install
```

### 3. Configurar variables de entorno (Backend)
Edita `.env`:
```
MONGODB_URI=mongodb://localhost:27017/jevanick
JWT_SECRET=tu_clave_secreta_muy_segura
PORT=5000
NODE_ENV=development
```

### 4. Instalar Frontend
```bash
cd ../frontend
npm install
```

### 5. Configurar variables de entorno (Frontend)
El archivo `.env` ya está configurado:
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 🚀 Ejecutar la Aplicación

### Terminal 1 - Ejecutar Backend
```bash
cd backend
npm start
# o para desarrollo con hot-reload:
npm run dev
```
El servidor estará disponible en: `http://localhost:5000`

### Terminal 2 - Ejecutar Frontend
```bash
cd frontend
npm start
```
La aplicación se abrirá en: `http://localhost:3000`

## 📝 Rutas Disponibles

### Públicas
- `/` - Página de inicio
- `/login` - Iniciar sesión
- `/register` - Registrarse

### Cliente (Privadas)
- `/client/dashboard` - Panel de cliente
- `/client/new-request` - Crear nueva solicitud

### Administrador (Privadas)
- `/admin/dashboard` - Panel de administrador
- `/admin/users` - Gestionar usuarios
- `/admin/requests` - Gestionar solicitudes

## 🔑 Credenciales de Prueba

Puedes crear nuevas cuentas registrándote o usar estas (después de crear):

```
Email: admin@jevanick.com
Contraseña: admin123
Rol: admin

Email: cliente@jevanick.com
Contraseña: cliente123
Rol: cliente
```

## 📊 Estructura del Proyecto

```
jevanick-platform/
├── backend/
│   ├── config/
│   │   └── db.js              # Configuración de MongoDB
│   ├── models/
│   │   ├── User.js            # Modelo de usuario
│   │   ├── AdvisoryRequest.js # Modelo de solicitud
│   │   └── Resource.js        # Modelo de recurso
│   ├── routes/
│   │   ├── auth.js            # Rutas de autenticación
│   │   ├── advisory.js        # Rutas de asesorías
│   │   ├── admin.js           # Rutas de admin
│   │   └── resources.js       # Rutas de recursos
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── advisoryController.js
│   │   ├── adminController.js
│   │   └── resourceController.js
│   ├── middleware/
│   │   └── auth.js            # Middleware de autenticación
│   ├── .env
│   ├── server.js              # Punto de entrada
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js
│   │   │   ├── PrivateRoute.js
│   │   │   └── UI.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── HomePage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── RegisterPage.js
│   │   │   ├── ClientDashboard.js
│   │   │   ├── NewRequestPage.js
│   │   │   ├── AdminDashboard.js
│   │   │   ├── AdminRequests.js
│   │   │   └── AdminUsers.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   ├── .env
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
└── README.md
```

## 🎨 Paleta de Colores JEVANICK

- **Azul Oscuro**: #1e3a8a (Primario)
- **Cian**: #06b6d4 (Secundario)
- **Verde Azulado**: #14b8a6 (Terciario)
- **Naranja**: #f97316 (Acento)

## 📚 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual

### Solicitudes de Asesoría
- `POST /api/advisory` - Crear solicitud
- `GET /api/advisory/my-requests` - Obtener mis solicitudes
- `GET /api/advisory/:id` - Obtener solicitud por ID
- `PUT /api/advisory/:id` - Actualizar solicitud

### Admin - Usuarios
- `GET /api/admin/users` - Obtener todos los usuarios
- `GET /api/admin/users/:id` - Obtener usuario por ID
- `PUT /api/admin/users/:id` - Actualizar estado del usuario
- `DELETE /api/admin/users/:id` - Eliminar usuario

### Admin - Solicitudes
- `GET /api/admin/requests` - Obtener todas las solicitudes
- `PUT /api/admin/requests/:id` - Actualizar solicitud
- `DELETE /api/admin/requests/:id` - Eliminar solicitud
- `GET /api/admin/dashboard/stats` - Obtener estadísticas

### Recursos
- `GET /api/resources` - Obtener recursos
- `POST /api/resources` - Crear recurso (Admin)
- `PUT /api/resources/:id` - Actualizar recurso (Admin)
- `DELETE /api/resources/:id` - Eliminar recurso (Admin)

## 🐛 Solución de Problemas

### MongoDB no conecta
- Asegúrate de que MongoDB esté ejecutándose: `mongod`
- Verifica la URI en `.env`

### Puerto 5000 en uso
```bash
# Cambiar en backend/.env
PORT=5001
```

### Puerto 3000 en uso
```bash
# Especificar puerto diferente
PORT=3001 npm start
```

## 📖 Próximas Mejoras

- [ ] Carga de archivos (CV, cartas)
- [ ] Sistema de notificaciones por email
- [ ] Chat en tiempo real
- [ ] Generador de PDF
- [ ] Análisis de solicitudes
- [ ] Integración con calendario

## 👨‍💻 Autor

Desarrollado para JEVANICK - Proyecto Integrador

## 📄 Licencia

MIT

---

**¿Necesitas ayuda?** Revisa la documentación o abre un issue.
