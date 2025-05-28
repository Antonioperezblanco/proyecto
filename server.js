//Librerias
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import cron from 'node-cron';

//Funciones
import connectDB from './backend/database/db.js';
import { eliminarFiestas } from './backend/tareas/cron.js';

cron.schedule('0 0 * * *', () => {
    console.log('Ejecutando limpieza de fiestas expiradas...');
    eliminarFiestas();
});

// Routes
import usuarioRoutes from './backend/routes/usuarioRoutes.js';
import fiestaRoutes from './backend/routes/fiestaRoutes.js';
import passwordRoutes from './backend/routes/passwordRoutes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const url = "mongodb://127.0.0.1/proyecto"; 

// 1. Conexión a la base de datos
connectDB(url).catch(err => {
    console.error("Error de conexión a MongoDB:", err);
    process.exit(1);
});

// 2. Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Configuración CORS
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// 4. Archivos estáticos (ORDEN CRÍTICO)
app.use('/css', express.static(path.join(__dirname, 'frontend', 'css')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/img', express.static(path.join(__dirname, 'frontend', 'img')));

// 5. Rutas dinámicas
app.use('/usuario', usuarioRoutes);
app.use('/fiesta', fiestaRoutes);
app.use('/pass', passwordRoutes);

// 6. Archivos estáticos generales (DEBE IR DESPUÉS de las rutas dinámicas)
app.use(express.static(path.join(__dirname, 'frontend'), {
    extensions: ['html'],
    index: false 
}));

// 7. Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// 8. Inicio del servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Ruta frontend: ${path.join(__dirname, 'frontend')}`);
});