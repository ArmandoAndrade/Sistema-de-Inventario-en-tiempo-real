# 📦 Sistema de Inventario en Tiempo Real

Este proyecto es un sistema de inventario en tiempo real desarrollado con **React + Vite** en el frontend y **Node.js + Express + Sequelize** en el backend. Permite gestionar productos, sedes, peticiones de traslado y usuarios, con comunicación en tiempo real mediante **Socket.io**.

---

## 🚀 Tecnologías utilizadas

### Frontend (`client`)
- React 19 + Vite 6
- TailwindCSS 4
- Material UI (MUI)
- Axios
- React Router DOM
- Socket.io-client

### Backend (`server`)
- Node.js + Express 5
- Sequelize + PostgreSQL
- Socket.io
- Bcrypt / Bcryptjs
- JSON Web Token
- Cors + Dotenv

---

## ⚙️ Instalación y uso

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/TU-USUARIO/TU-REPO.git
cd TU-REPO
```
### 2️⃣ Instalar dependencias del cliente
```bash
cd client
npm install
# o pnpm install
```
### 3️⃣ Instalar dependencias del servidor
```bash
cd ../server
npm install
# o pnpm install
```
---
### 📂 Estructura del proyecto
```bash
project-root/
├── client/                          # Frontend
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosInstance.js
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── shared/
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── peticiones/
│   │   │   └── productos/
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
│   └── vite.config.js
│
├── server/                          # Backend
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── inventoryController.js
│   │   ├── peticionesController.js
│   │   └── productsController.js
│   ├── middlewares/
│   │   ├── auth.js
│   │   ├── socketMiddleware.js
│   │   └── verificarAdmin.js
│   ├── models/
│   │   ├── InventarioSede.js
│   │   ├── Movimiento.js
│   │   ├── PeticionTraslado.js
│   │   ├── Producto.js
│   │   ├── Sede.js
│   │   ├── Usuario.js
│   │   └── index.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── inventory.js
│   │   └── peticiones.js
│   ├── use_cases/
│   │   ├── notificaciones/
│   │   ├── peticiones/
│   │   └── productos/
│   ├── app.js
│   ├── server.js
│   ├── package-lock.json
│   └── package.json

```