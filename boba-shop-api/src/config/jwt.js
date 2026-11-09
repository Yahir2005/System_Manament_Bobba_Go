const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../..', '.env') });

/**
 * ============================================================================
 * CONFIGURACIÓN DE JWT (jwt.js) - Basado en Inventario_Travelnet
 * ============================================================================
 */
const getSecret = () => {
    const secret = process.env.JWT_SECRET || 'super_secret_jwt_bobba_go_2026_secure_key_123456';
    if (!secret || typeof secret !== 'string' || secret.trim().length < 16) {
        throw new Error('Configuración crítica: JWT_SECRET debe tener al menos 16 caracteres.');
    }
    return secret;
};

module.exports = { getSecret };
