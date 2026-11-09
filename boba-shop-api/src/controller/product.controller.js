exports.createProduct = async (req, res) => {
  try {
    const { id_category, name, description, price } = req.body;
    
    // Si subió archivo, construimos la URL relativa que se guarda en la base de datos
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;
    const created_by = req.user.id_user; // Obtenido del token JWT del empleado/admin

    const [result] = await db.execute(
      `INSERT INTO products (id_category, name, description, price, image_url, status, created_by)
       VALUES (?, ?, ?, ?, ?, 'pending', ?)`,
      [id_category, name, description, price, image_url, created_by]
    );

    res.status(201).json({ 
      id_product: result.insertId,
      message: 'Producto creado y enviado a aprobación.' 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar producto', error: error.message });
  }
};