const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const Usuario = require('../model/usuario');

/**
 * ============================================================================
 * CONTROLADOR DE AUTENTICACIÓN (authController.js) - Basado en Inventario_Travelnet
 * ============================================================================
 */
const login = async (req, res) => {
    try {
        const credentials = req.body;
        const user = await Usuario.login(credentials);

        if (!user) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
        }

        const token = jwt.sign(
            {
                id_user: user.id_user,
                id_role: user.id_role,
                role: user.role,
                name: user.name,
                email: user.email
            },
            jwtConfig.getSecret(),
            { expiresIn: '8h' }
        );

        res.json({
            message: 'Login exitoso',
            token: token,
            user: user
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error interno en el servidor durante la autenticación.' });
    }
};

const me = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'No autenticado.' });
        }
        const user = await Usuario.findByPk(req.user.id_user);
        res.json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await Usuario.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { login, me, getAllUsers };
