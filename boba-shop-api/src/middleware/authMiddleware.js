const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

/**
 * ============================================================================
 * MIDDLEWARE DE AUTENTICACIÓN JWT (authMiddleware.js) - Basado en Inventario_Travelnet
 * ============================================================================
 * Extrae y valida el token Bearer en las cabeceras HTTP de las peticiones protegidas.
 */
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];

    if (!authHeader) {
        return res.status(401).json({ error: 'No autorizado. Falta el token de acceso.' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ error: 'Formato de token inválido. Debe ser Bearer <token>.' });
    }

    const token = parts[1];

    try {
        const decoded = jwt.verify(token, jwtConfig.getSecret());
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Token inválido o expirado.' });
    }
};

/** Middleware para exigir rol de administrador */
const requireAdmin = (req, res, next) => {
    if (!req.user || (req.user.id_role !== 1 && req.user.role !== 'administrator')) {
        return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de Administrador.' });
    }
    next();
};

module.exports = { verifyToken, requireAdmin };
