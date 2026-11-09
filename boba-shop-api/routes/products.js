const express = require('express');
const router = express.Router();
const productController = require('../src/controller/productController');
const upload = require('../src/config/multer');
const { verifyToken, requireAdmin } = require('../src/middleware/authMiddleware');

// Tipos de Producto
router.get('/product-types', productController.getProductTypes);

// Categorías (Solo el administrador puede agregar nuevas categorías)
router.get('/categories', productController.getCategories);
router.post('/categories', verifyToken, requireAdmin, productController.createCategory);

// Productos
router.get('/products/approved', productController.getApprovedProducts);
router.get('/products/pending', productController.getPendingProducts);
router.get('/products/:id', productController.getProductById);
router.get('/products', productController.getAllProducts);
router.post('/products', upload.single('image'), productController.createProduct);
router.put('/products/:id', upload.single('image'), productController.updateProduct);
router.patch('/products/:id/status', productController.reviewProduct);

module.exports = router;
