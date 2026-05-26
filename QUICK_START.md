# 🚀 Guía Rápida de Instalación

## Paso 1: Instalar dependencias del Backend
```bash
cd backend
npm install
```

## Paso 2: Iniciar MongoDB
Asegúrate de que MongoDB esté corriendo:
```bash
mongod
```

## Paso 3: Iniciar el Backend
En la carpeta `backend/`:
```bash
npm start
# o para desarrollo:
npm run dev
```
✅ Backend disponible en: `http://localhost:5000`

## Paso 4: Instalar dependencias del Frontend
En otra terminal, en la carpeta `frontend/`:
```bash
npm install
```

## Paso 5: Iniciar el Frontend
```bash
npm start
```
✅ Frontend disponible en: `http://localhost:3000`

## ✨ ¡Listo!

- 🏠 Accede a `http://localhost:3000`
- 📝 Registra una nueva cuenta
- 🔑 Inicia sesión con tus credenciales
- 📊 Explora el dashboard según tu rol

---

## 🆘 Solución rápida de problemas

| Problema | Solución |
|----------|----------|
| "Cannot connect to MongoDB" | Ejecuta `mongod` en otra terminal |
| "Port 5000 already in use" | Cambia `PORT=5001` en `backend/.env` |
| "Port 3000 already in use" | Ejecuta `PORT=3001 npm start` en frontend |
| "Module not found" | Ejecuta `npm install` en la carpeta correspondiente |

---

**¡A disfrutar desarrollando JEVANICK! 🎉**
