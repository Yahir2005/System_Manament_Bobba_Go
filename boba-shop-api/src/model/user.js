/**
 * ============================================================================
 * MODELO: Usuario (src/model/usuario.js) - Basado en Inventario_Travelnet
 * ============================================================================
 * Gestiona la tabla `users` (Administradores, Empleados, Clientes).
 * Encripta contraseñas con bcrypt, verifica credenciales en login y sanitiza
 * los datos antes de responder.
 */

const bcrypt = require('bcrypt');
const pool = require('../config/database');

const SALT_ROUNDS = 10;

/** Remueve el hash de la contraseña de la respuesta */
const sanitize = (row) => {
    if (!row) return null;
    const { password_hash, ...safe } = row;
    return safe;
};

const Usuario = {
    /** Busca un usuario por ID */
    findByPk: async (id) => {
        const rows = await pool.query(
            `SELECT u.id_user, u.id_role, r.name AS role, u.name, u.email, u.is_active, u.created_at
             FROM users u
             INNER JOIN roles r ON u.id_role = r.id_role
             WHERE u.id_user = ?`,
            [id]
        );
        return rows.length > 0 ? rows[0] : null;
    },

    /** Busca un usuario por Email */
    findByEmail: async (email) => {
        const rows = await pool.query(
            `SELECT u.id_user, u.id_role, r.name AS role, u.name, u.email, u.password_hash, u.is_active, u.created_at
             FROM users u
             INNER JOIN roles r ON u.id_role = r.id_role
             WHERE u.email = ?`,
            [email]
        );
        return rows.length > 0 ? rows[0] : null;
    },

    /** Lista todos los usuarios activos */
    findAll: async () => {
        const rows = await pool.query(
            `SELECT u.id_user, u.id_role, r.name AS role, u.name, u.email, u.is_active, u.created_at
             FROM users u
             INNER JOIN roles r ON u.id_role = r.id_role
             ORDER BY u.id_user ASC`
        );
        return rows.map(sanitize);
    },

    /** Registra un nuevo usuario encriptando la contraseña */
    create: async (data) => {
        const passwordToHash = data.password || data.Password || data.password_hash;
        if (!passwordToHash) {
            throw new Error('La contraseña es obligatoria.');
        }

        const hash = bcrypt.hashSync(passwordToHash, SALT_ROUNDS);
        const result = await pool.query(
            `INSERT INTO users (id_role, name, email, password_hash, is_active)
             VALUES (?, ?, ?, ?, ?)`,
            [
                data.id_role || 2, // 2: employee por defecto
                data.name || data.Nombre,
                data.email || data.Email,
                hash,
                data.is_active !== undefined ? (data.is_active ? 1 : 0) : 1
            ]
        );

        return await Usuario.findByPk(Number(result.insertId));
    },

    /**
     * Valida credenciales de login comparando con bcrypt
     */
    login: async (credentials) => {
        const email = credentials.email || credentials.Email || credentials.usuario || credentials.Usuario;
        const password = credentials.password || credentials.Password || credentials.password_hash;

        if (!email || !password) {
            return null;
        }

        const user = await Usuario.findByEmail(email);
        if (!user || !user.is_active) {
            return null;
        }

        const isValid = bcrypt.compareSync(password, user.password_hash);
        if (!isValid) {
            return null;
        }

        return sanitize(user);
    }
};

module.exports = Usuario;
