# Aplicación web de veterinaria

Sitio responsive desarrollado con Angular. Los servicios, especialidades, precios, datos institucionales y fotografías se cargan desde la API; el formulario y el asistente virtual también se conectan al backend.

## Requisitos

- Node.js 20 o posterior y npm.
- API de backend disponible en `http://localhost:3000`.

## Instalación y configuración

```powershell
npm install
```

La URL de la API se configura en `src/environments/environment.ts` (`apiUrl`). Actualícela para apuntar al backend de su entorno.

## Desarrollo

```powershell
npm start
```

Abra `http://localhost:4200`. Para compilar la versión de producción, ejecute `npm run build`.

## Ejecutar frontend y backend

En dos terminales, desde las carpetas correspondientes:

```powershell
# Terminal 1, backend
npm run dev
```

```powershell
# Terminal 2, frontend
npm start
```

Antes de iniciar el backend, configure `backend/.env`, cree la base `veterinariadb` desde pgAdmin y ejecute `backend/database/schema.sql`. Siga las instrucciones de configuración en el README del backend.
