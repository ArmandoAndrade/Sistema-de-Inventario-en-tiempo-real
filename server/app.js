//config principal de express
import express from 'express';
import cors from 'cors';
import inventoryRoutes from './routes/inventory.js';
import peticionesRoutes from './routes/peticiones.js';
import auth from './routes/auth.js';
import { testConnection, sequelize } from './config/db.js';

const app = express();

//middlewares
// Configuración CORS para Express (debe coincidir con Socket.IO)
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true, // Permite enviar cookies y encabezados de autorización
}));
app.use(express.json());

//rutas
app.use('/api/products', inventoryRoutes);
app.use('/api/peticiones', peticionesRoutes)
app.use('/api', auth);

//ruta de prueba
app.get('/', (req, res) => {
    res.send("Api inventario funcionando")
})

//conexión DB
const startServer = async () => {
    await testConnection();
    await sequelize.sync({ alter: true }) //crea la tabla si no existe y borra y sobreescribe si existe
        .then(() => console.log('tablas creadas'))
        .catch((error) => console.error('Error al crear tablas:', error))
}

startServer();

export default app;

