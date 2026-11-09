const bcrypt = require('bcrypt');
const pool = require('./database');

async function seed() {
    let conn;
    try {
        conn = await pool.getConnection();

        // 1. Roles
        const existingRoles = await conn.query('SELECT COUNT(*) AS total FROM roles');
        if (Number(existingRoles[0].total) === 0) {
            await conn.query("INSERT INTO roles (id_role, name) VALUES (1, 'administrator'), (2, 'employee'), (3, 'client')");
            console.log('Roles seeded.');
        }

        // 2. Users (Admin & Employee)
        const existingUsers = await conn.query('SELECT COUNT(*) AS total FROM users');
        if (Number(existingUsers[0].total) === 0) {
            const adminPass = bcrypt.hashSync('admin123', 10);
            const employeePass = bcrypt.hashSync('empleado123', 10);

            await conn.query(
                `INSERT INTO users (id_role, name, email, password_hash, is_active) VALUES 
                (1, 'Administrador Bobba', 'admin@bobago.com', ?, TRUE),
                (2, 'Empleado Mostrador', 'empleado@bobago.com', ?, TRUE)`,
                [adminPass, employeePass]
            );
            console.log('Users seeded (admin@bobago.com / admin123, empleado@bobago.com / empleado123).');
        }

        // 3. Product Types
        const existingTypes = await conn.query('SELECT COUNT(*) AS total FROM product_types');
        if (Number(existingTypes[0].total) === 0) {
            await conn.query("INSERT INTO product_types (id_type, name) VALUES (1, 'Beverage'), (2, 'Food')");
            console.log('Product types seeded.');
        }

        // 4. Categories
        const existingCats = await conn.query('SELECT COUNT(*) AS total FROM categories');
        if (Number(existingCats[0].total) === 0) {
            await conn.query(
                `INSERT INTO categories (id_category, id_type, name) VALUES 
                (1, 1, 'Boba Tea Tradicional'),
                (2, 1, 'Sodas Italianas'),
                (3, 1, 'Infusiones Frutales'),
                (4, 2, 'Pasteles y Repostería'),
                (5, 2, 'Snacks'),
                (6, 1, 'Cafés y Bebidas Calientes')`
            );
            console.log('Categories seeded.');
        }

        // 5. Products
        const existingProds = await conn.query('SELECT COUNT(*) AS total FROM products');
        if (Number(existingProds[0].total) === 0) {
            await conn.query(
                `INSERT INTO products (id_category, name, description, price, image_url, status, created_by, approved_by, approved_at) VALUES 
                (1, 'Taro Milk Tea con Perlas', 'Delicioso té de taro artesanal con perlas de tapioca negra recién cocinadas.', 65.00, 'https://images.unsplash.com/photo-1558857563-b37cf5a917a2?w=500', 'approved', 2, 1, NOW()),
                (1, 'Brown Sugar Boba Milk', 'Leche entera cremosa con jarabe de azúcar morena flameada y perlas tibias.', 70.00, 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=500', 'approved', 2, 1, NOW()),
                (2, 'Soda Italiana Maracuyá', 'Bebida refrescante gasificada con jarabe artesanal de maracuyá y menta fresca.', 55.00, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500', 'approved', 2, 1, NOW()),
                (3, 'Té Verde Jazmín Frutal', 'Infusión aromática de jazmín con trozos de fresa y mango natural.', 50.00, 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500', 'approved', 2, 1, NOW()),
                (4, 'Cheesecake Japonés de Matcha', 'Bizcocho esponjoso y ligero elaborado con auténtico té verde matcha.', 60.00, 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500', 'approved', 2, 1, NOW()),
                (6, 'Café Latte Vainilla', 'Delicioso café espresso premium con leche vaporizada y jarabe de vainilla natural.', 55.00, 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500', 'approved', 1, 1, NOW()),
                (1, 'Matcha Latte Boba (Pendiente)', 'Té verde matcha ceremonial con perlas de tapioca y leche de avena.', 75.00, 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500', 'pending', 2, NULL, NULL)`
            );
            console.log('Sample products seeded.');
        }

        console.log('Seeding finished successfully.');
    } catch (err) {
        console.error('Error during seeding:', err);
    } finally {
        if (conn) conn.release();
        process.exit(0);
    }
}

seed();
