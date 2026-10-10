const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const env = require('./config/env');
const routes = require('./interfaces/routes');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

app.set('trust proxy', '10.0.0.8');

// Oculta información sobre Express
app.disable('x-powered-by');

// Cabeceras HTTP de seguridad
app.use(helmet());

// Limita el tamaño de los JSON recibidos
app.use(express.json({
    limit: '10kb'
}));

// CORS: solamente permitimos nuestro frontend
app.use(cors({
    origin: env.FRONTEND_ORIGIN,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Ruta básica para comprobar el estado de la API
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        service: 'zero-trust-backend'
    });
});

// Rutas de la aplicación
app.use('/api', routes);

// Ruta no encontrada
app.use((req, res) => {
    res.status(404).json({
        error: 'Recurso no encontrado'
    });
});

app.use(errorMiddleware);

module.exports = app;