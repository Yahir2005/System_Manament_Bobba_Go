const pool = require('../config/database');

/**
 * ============================================================================
 * CONTROLADOR DE CANJE DE RECOMPENSAS (rewardsController.js)
 * ============================================================================
 */
const getEligibleRewardProducts = async (req, res) => {
    try {
        const rows = await pool.query(
            `SELECT p.id_product, p.name, c.name AS category_name, p.image_url
             FROM products p
             INNER JOIN categories c ON p.id_category = c.id_category
             WHERE p.status = 'approved'
             ORDER BY p.name ASC`
        );

        res.json(rows.map((r) => ({
            id_product: Number(r.id_product),
            name: r.name,
            category_name: r.category_name,
            image_url: r.image_url
        })));
    } catch (error) {
        console.error('Error al obtener productos elegibles:', error);
        res.status(500).json({ error: error.message });
    }
};

const claimReward = async (req, res) => {
    try {
        const { id_customer, id_product } = req.body;
        if (!id_customer || !id_product) {
            return res.status(400).json({ error: 'Cliente y producto son requeridos.' });
        }

        const customerRows = await pool.query(
            'SELECT * FROM customers WHERE id_customer = ?',
            [Number(id_customer)]
        );

        if (customerRows.length === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado.' });
        }

        const customer = customerRows[0];
        if (Number(customer.stamps_count) < 10) {
            return res.status(400).json({
                error: `Sellos insuficientes. Se requieren 10 sellos, el cliente tiene ${customer.stamps_count}.`
            });
        }

        const authorizedBy = req.user ? req.user.id_user : 2;

        const result = await pool.query(
            'INSERT INTO redeemed_rewards (id_customer, id_product, authorized_by) VALUES (?, ?, ?)',
            [Number(id_customer), Number(id_product), authorizedBy]
        );

        // Descontar 10 sellos
        const newStamps = Number(customer.stamps_count) - 10;
        await pool.query(
            'UPDATE customers SET stamps_count = ? WHERE id_customer = ?',
            [newStamps, Number(id_customer)]
        );

        res.status(201).json({
            id_redemption: Number(result.insertId),
            id_customer: Number(id_customer),
            id_product: Number(id_product),
            authorized_by: authorizedBy,
            redeemed_at: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error en canje de recompensa:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getEligibleRewardProducts, claimReward };
