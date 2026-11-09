const pool = require('../config/database');

/**
 * ============================================================================
 * CONTROLADOR DE PRODUCTOS Y CATEGORÍAS (productController.js)
 * ============================================================================
 */

// Obtener tipos de producto (Bebida / Alimento)
const getProductTypes = async (req, res) => {
    try {
        const rows = await pool.query('SELECT id_type, name FROM product_types ORDER BY id_type ASC');
        res.json(rows.map((r) => ({
            id_type: Number(r.id_type),
            name: r.name
        })));
    } catch (error) {
        console.error('Error al obtener tipos de productos:', error);
        res.status(500).json({ error: error.message });
    }
};

// Crear nueva categoría (exclusivo para administradores)
const createCategory = async (req, res) => {
    try {
        const { name, id_type } = req.body;
        if (!name || !name.trim() || !id_type) {
            return res.status(400).json({ error: 'El nombre y el tipo de producto son obligatorios.' });
        }

        const trimmedName = name.trim();
        const existing = await pool.query('SELECT id_category FROM categories WHERE LOWER(name) = LOWER(?)', [trimmedName]);
        if (existing.length > 0) {
            return res.status(400).json({ error: `La categoría "${trimmedName}" ya existe.` });
        }

        const result = await pool.query(
            'INSERT INTO categories (id_type, name) VALUES (?, ?)',
            [Number(id_type), trimmedName]
        );

        const newRows = await pool.query(
            `SELECT c.id_category, c.id_type, c.name, pt.name AS type_name
             FROM categories c
             INNER JOIN product_types pt ON c.id_type = pt.id_type
             WHERE c.id_category = ?`,
            [Number(result.insertId)]
        );

        res.status(201).json({
            id_category: Number(newRows[0].id_category),
            id_type: Number(newRows[0].id_type),
            name: newRows[0].name,
            type: {
                id_type: Number(newRows[0].id_type),
                name: newRows[0].type_name
            }
        });
    } catch (error) {
        console.error('Error al crear categoría:', error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener categorías para dropdown
const getCategories = async (req, res) => {
    try {
        const rows = await pool.query(
            `SELECT c.id_category, c.id_type, c.name,
                    pt.id_type AS type_id_type, pt.name AS type_name
             FROM categories c
             INNER JOIN product_types pt ON c.id_type = pt.id_type
             ORDER BY c.name ASC`
        );

        const formatted = rows.map((r) => ({
            id_category: Number(r.id_category),
            id_type: Number(r.id_type),
            name: r.name,
            type: {
                id_type: Number(r.type_id_type),
                name: r.type_name
            }
        }));

        res.json(formatted);
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).json({ error: error.message });
    }
};

// Formatea fila de producto con su categoría anidada
const formatProduct = (p) => ({
    id_product: Number(p.id_product),
    id_category: Number(p.id_category),
    name: p.name,
    description: p.description,
    price: Number(p.price),
    image_url: p.image_url,
    status: p.status,
    created_by: Number(p.created_by),
    approved_by: p.approved_by ? Number(p.approved_by) : null,
    approved_at: p.approved_at,
    created_at: p.created_at,
    category: p.category_name ? {
        id_category: Number(p.id_category),
        id_type: Number(p.id_type),
        name: p.category_name
    } : undefined
});

// Listar todos los productos
const getAllProducts = async (req, res) => {
    try {
        const rows = await pool.query(
            `SELECT p.*, c.name AS category_name, c.id_type
             FROM products p
             LEFT JOIN categories c ON p.id_category = c.id_category
             ORDER BY p.id_product DESC`
        );
        res.json(rows.map(formatProduct));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Listar productos aprobados
const getApprovedProducts = async (req, res) => {
    try {
        const rows = await pool.query(
            `SELECT p.*, c.name AS category_name, c.id_type
             FROM products p
             LEFT JOIN categories c ON p.id_category = c.id_category
             WHERE p.status = 'approved'
             ORDER BY p.name ASC`
        );
        res.json(rows.map(formatProduct));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Listar productos pendientes de aprobación
const getPendingProducts = async (req, res) => {
    try {
        const rows = await pool.query(
            `SELECT p.*, c.name AS category_name, c.id_type
             FROM products p
             LEFT JOIN categories c ON p.id_category = c.id_category
             WHERE p.status = 'pending'
             ORDER BY p.created_at DESC`
        );
        res.json(rows.map(formatProduct));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Registrar nuevo producto (status='pending', soporta subida de archivo con multer o URL directa)
const createProduct = async (req, res) => {
    try {
        const { id_category, name, description, price } = req.body;

        if (!id_category || !name || price === undefined || price === '') {
            return res.status(400).json({ error: 'Categoría, nombre y precio son obligatorios.' });
        }

        // Determinar URL de la imagen (archivo subido mediante multer o URL textual)
        let image_url = null;
        if (req.file) {
            image_url = `http://localhost:3000/uploads/${req.file.filename}`;
        } else if (req.body.image_url) {
            image_url = req.body.image_url;
        }

        const userId = req.user ? req.user.id_user : 2; // Default employee if not authenticated

        const result = await pool.query(
            `INSERT INTO products (id_category, name, description, price, image_url, status, created_by)
             VALUES (?, ?, ?, ?, ?, 'pending', ?)`,
            [Number(id_category), name, description || null, Number(price), image_url, userId]
        );

        const newRows = await pool.query(
            `SELECT p.*, c.name AS category_name, c.id_type
             FROM products p
             LEFT JOIN categories c ON p.id_category = c.id_category
             WHERE p.id_product = ?`,
            [Number(result.insertId)]
        );

        res.status(201).json(formatProduct(newRows[0]));
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ error: error.message });
    }
};

// Cambiar estatus de un producto (aprobado o rechazado)
const reviewProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ error: "El estatus debe ser 'approved' o 'rejected'." });
        }

        const approverId = req.user ? req.user.id_user : 1;

        await pool.query(
            `UPDATE products 
             SET status = ?, approved_by = ?, approved_at = NOW()
             WHERE id_product = ?`,
            [status, approverId, Number(id)]
        );

        const updatedRows = await pool.query(
            `SELECT p.*, c.name AS category_name, c.id_type
             FROM products p
             LEFT JOIN categories c ON p.id_category = c.id_category
             WHERE p.id_product = ?`,
            [Number(id)]
        );

        if (updatedRows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }

        res.json(formatProduct(updatedRows[0]));
    } catch (error) {
        console.error('Error al revisar producto:', error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener un producto por su ID
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const rows = await pool.query(
            `SELECT p.*, c.name AS category_name, c.id_type
             FROM products p
             LEFT JOIN categories c ON p.id_category = c.id_category
             WHERE p.id_product = ?`,
            [Number(id)]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }

        res.json(formatProduct(rows[0]));
    } catch (error) {
        console.error('Error al obtener producto por ID:', error);
        res.status(500).json({ error: error.message });
    }
};

// Actualizar producto existente (los cambios pasan a estado 'pending' y requieren autorización del administrador)
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_category, name, description, price } = req.body;

        if (!id_category || !name || price === undefined || price === '') {
            return res.status(400).json({ error: 'Categoría, nombre y precio son obligatorios.' });
        }

        // Obtener el producto actual para conservar su imagen si no se subió una nueva
        const currentRows = await pool.query('SELECT * FROM products WHERE id_product = ?', [Number(id)]);
        if (currentRows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }
        const currentProduct = currentRows[0];

        // Determinar URL de imagen (si se subió archivo nuevo con multer, o si se mantiene la previa)
        let image_url = currentProduct.image_url;
        if (req.file) {
            image_url = `http://localhost:3000/uploads/${req.file.filename}`;
        } else if (req.body.image_url !== undefined && req.body.image_url !== null) {
            image_url = req.body.image_url;
        }

        // IMPORTANTE: Al editar, el producto pasa a estado 'pending' y resetea su aprobación.
        // De esta manera, el cambio no se presentará en el menú público del cliente hasta que el admin lo autorice.
        await pool.query(
            `UPDATE products 
             SET id_category = ?, name = ?, description = ?, price = ?, image_url = ?,
                 status = 'pending', approved_by = NULL, approved_at = NULL
             WHERE id_product = ?`,
            [Number(id_category), name.trim(), description ? description.trim() : null, Number(price), image_url, Number(id)]
        );

        const updatedRows = await pool.query(
            `SELECT p.*, c.name AS category_name, c.id_type
             FROM products p
             LEFT JOIN categories c ON p.id_category = c.id_category
             WHERE p.id_product = ?`,
            [Number(id)]
        );

        res.json(formatProduct(updatedRows[0]));
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getProductTypes,
    createCategory,
    getCategories,
    getAllProducts,
    getApprovedProducts,
    getPendingProducts,
    getProductById,
    createProduct,
    updateProduct,
    reviewProduct
};
