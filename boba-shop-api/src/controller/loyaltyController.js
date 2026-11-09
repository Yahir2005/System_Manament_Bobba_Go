const pool = require('../config/database');

/**
 * ============================================================================
 * CONTROLADOR DE LEALTAD Y CÓDIGOS QR (loyaltyController.js)
 * ============================================================================
 */
const getCustomerCard = async (req, res) => {
    try {
        const { id } = req.params;
        const rows = await pool.query(
            'SELECT id_customer, name, phone, qr_code, stamps_count, created_at FROM customers WHERE id_customer = ?',
            [Number(id)]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }

        const c = rows[0];
        res.json({
            id_customer: Number(c.id_customer),
            name: c.name,
            phone: c.phone,
            qr_code: c.qr_code,
            stamps_count: Number(c.stamps_count),
            created_at: c.created_at
        });
    } catch (error) {
        console.error('Error al obtener tarjeta de cliente:', error);
        res.status(500).json({ error: error.message });
    }
};

const scanQr = async (req, res) => {
    try {
        const { qr_code } = req.body;
        if (!qr_code) {
            return res.status(400).json({ success: false, message: 'Código QR requerido' });
        }

        const rows = await pool.query(
            'SELECT * FROM customers WHERE qr_code = ?',
            [qr_code]
        );

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Código QR no registrado' });
        }

        const customer = rows[0];
        const registeredBy = req.user ? req.user.id_user : 2;

        // Regla anti-abuso de 12 horas
        const visits = await pool.query(
            `SELECT visited_at, TIMESTAMPDIFF(HOUR, visited_at, NOW()) AS hours_since
             FROM loyalty_visits
             WHERE id_customer = ?
             ORDER BY visited_at DESC LIMIT 1`,
            [customer.id_customer]
        );

        if (visits.length > 0 && visits[0].hours_since < 12) {
            const hoursLeft = 12 - Number(visits[0].hours_since);
            return res.status(200).json({
                success: false,
                message: `Límite alcanzado: Ya acumulaste un sello recientemente. Podrás acumular otro en ${hoursLeft} horas.`,
                stamps_count: Number(customer.stamps_count),
                eligible_for_reward: Number(customer.stamps_count) >= 10,
                hours_since_last_stamp: Number(visits[0].hours_since)
            });
        }

        // Registrar visita y sumar sello
        await pool.query(
            'INSERT INTO loyalty_visits (id_customer, registered_by) VALUES (?, ?)',
            [customer.id_customer, registeredBy]
        );

        const newStamps = Number(customer.stamps_count) + 1;
        await pool.query(
            'UPDATE customers SET stamps_count = ? WHERE id_customer = ?',
            [newStamps, customer.id_customer]
        );

        const eligible = newStamps >= 10;
        res.json({
            success: true,
            message: eligible
                ? '¡Felicidades! Has completado tus 10 sellos. Tienes una bebida gratis lista para canjear.'
                : `¡Sello registrado con éxito! Llevas ${newStamps} de 10 sellos.`,
            stamps_count: newStamps,
            eligible_for_reward: eligible
        });
    } catch (error) {
        console.error('Error en escaneo de QR:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getCustomerCard, scanQr };
