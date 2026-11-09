const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../..', '.env') });
const mariadb = require('mariadb');

/**
 * ============================================================================
 * CONFIGURACIÓN DE BASE DE DATOS (database.js) - Basado en Inventario_Travelnet
 * ============================================================================
 * Administra el pool de conexiones a MariaDB para la base de datos boba_shop.
 */
const pool = mariadb.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    user: process.env.DB_USER || 'Admin',
    password: process.env.DB_PASS || '0110',
    database: process.env.DB_NAME || 'boba_shop',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
