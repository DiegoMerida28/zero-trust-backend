const mysql = require('mysql2/promise');
const env = require('../config/env');

const pool = mysql.createPool({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function testConnection() {
    let connection;

    try {
        connection = await pool.getConnection();
        await connection.query('SELECT 1');

        console.log('Conexión a MySQL establecida correctamente.');
        return true;
    } catch (error) {
        console.error('Error al conectar con MySQL:', error.message);
        return false;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

module.exports = {
    pool,
    testConnection
};