const pool = require('../config/database');

/**
 * ============================================================================
 * CONTROLADOR DEL MENÚ PÚBLICO (menuController.js)
 * ============================================================================
 * Agrupa los productos aprobados por Tipo (Bebida / Comida) y por Categoría.
 */
const getPublicMenu = async (req, res) => {
    try {
        const types = await pool.query('SELECT id_type, name FROM product_types ORDER BY id_type ASC');
        const categories = await pool.query('SELECT id_category, id_type, name FROM categories ORDER BY name ASC');
        const products = await pool.query(
            `SELECT p.id_product, p.id_category, p.name, p.description, p.price, p.image_url,
                    c.name AS category_name, pt.name AS type_name, c.id_type
             FROM products p
             INNER JOIN categories c ON p.id_category = c.id_category
             INNER JOIN product_types pt ON c.id_type = pt.id_type
             WHERE p.status = 'approved'
             ORDER BY p.name ASC`
        );

        // Agrupamos en la estructura MenuSection[]
        const sections = types.map((type) => {
            const typeCategories = categories.filter((c) => c.id_type === type.id_type);

            const catGroups = typeCategories.map((cat) => {
                const catProducts = products
                    .filter((p) => p.id_category === cat.id_category)
                    .map((p) => ({
                        id_product: Number(p.id_product),
                        name: p.name,
                        description: p.description,
                        price: Number(p.price),
                        image_url: p.image_url,
                        category_name: p.category_name,
                        type_name: p.type_name
                    }));

                return {
                    category: {
                        id_category: Number(cat.id_category),
                        id_type: Number(cat.id_type),
                        name: cat.name
                    },
                    products: catProducts
                };
            }).filter((cg) => cg.products.length > 0); // Solo categorías con productos disponibles

            return {
                type: {
                    id_type: Number(type.id_type),
                    name: type.name
                },
                categories: catGroups
            };
        }).filter((section) => section.categories.length > 0);

        res.json(sections);
    } catch (error) {
        console.error('Error al obtener menú público:', error);
        res.status(500).json({ error: 'Error al consultar el menú público.' });
    }
};

module.exports = { getPublicMenu };
