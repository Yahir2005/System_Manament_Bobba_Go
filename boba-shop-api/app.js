const express = require('express');
const cors = require('cors');
const path = require('path');
const logger = require('morgan');

const authRouter = require('./routes/auth');
const menuRouter = require('./routes/menu');
const productsRouter = require('./routes/products');
const loyaltyRouter = require('./routes/loyalty');
const rewardsRouter = require('./routes/rewards');

const app = express();

// Convierte BigInt de MariaDB a String al enviar respuestas JSON (patrón Inventario_Travelnet)
BigInt.prototype.toJSON = function () {
    return this.toString();
};

// Middlewares globales
app.use(logger('dev'));
app.use(cors({
    origin: ['http://localhost:4200', 'http://127.0.0.1:4200', 'http://localhost:8080'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos subidos (imágenes de productos)
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Endpoint de verificación de salud
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Boba Shop API running smoothly' });
});

// Rutas de la API
app.use('/api/auth', authRouter);
app.use('/api/usuarios', authRouter);
app.use('/api/menu', menuRouter);
app.use('/api/loyalty', loyaltyRouter);
app.use('/api/rewards', rewardsRouter);
app.use('/api', productsRouter);

// Manejo de rutas no encontradas (404)
app.use((req, res, next) => {
    res.status(404).json({
        error: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
    });
});

// Manejo centralizado de errores
app.use((err, req, res, next) => {
    console.error('Error no controlado:', err);
    const status = err.status || err.statusCode || 500;
    res.status(status).json({
        error: err.message || 'Error interno del servidor'
    });
});

module.exports = app;
