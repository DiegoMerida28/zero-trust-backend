const app = require('./app');
const env = require('./config/env');
const { testConnection } = require('./infrastructure/db');

async function startServer() {
    try {
        const databaseConnected = await testConnection();

        if (!databaseConnected) {
            console.error('No se pudo establecer conexión con la base de datos.');
            process.exit(1);
        }

        app.listen(env.PORT, () => {
            console.log(`Servidor iniciado en el puerto ${env.PORT}`);
            console.log(`Entorno: ${env.NODE_ENV}`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error.message);
        process.exit(1);
    }
}

startServer();