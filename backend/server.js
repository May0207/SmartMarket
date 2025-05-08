const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const db = require("./db");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Ruta base
app.get("/", (req, res) => {
  res.send("API funcionando correctamente");
});

// RUTA DE PRODUCTOS — NO TOCAR
app.get("/api/productos", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 25;
    const offset = parseInt(req.query.offset) || 0;
    const precioMax = parseFloat(req.query.precioMax) || 100000;
    const supermercados = req.query.super || [];
    const searchTerm = req.query.search || '';
    const nutritionField = req.query.nutritionField;
    const nutritionOrder = req.query.nutritionOrder;

    const validFields = ['calorias', 'proteinas', 'grasas', 'hidratos_carbono', 'azucares'];

    let orderBy = 'ORDER BY p.id_producto ASC';
    if (nutritionField && validFields.includes(nutritionField)) {
      orderBy = `
        ORDER BY 
          CASE 
            WHEN ${nutritionField} IS NULL OR ${nutritionField} = 0 THEN 1 
            ELSE 0 
          END ASC,
          ${nutritionField} ${nutritionOrder === 'asc' ? 'ASC' : 'DESC'}
      `;
    }

    const superArray = Array.isArray(supermercados)
      ? supermercados
      : supermercados
      ? [supermercados]
      : [];

    const supermercadoFiltro = superArray.length
      ? `AND s.nombre IN (${superArray.map(() => "?").join(", ")})`
      : "";

    const nombreFiltro = searchTerm ? `AND p.nombre LIKE ?` : "";

    const query = `
      SELECT 
        p.id_producto AS id,
        p.nombre AS name,
        s.nombre AS supermercado,
        p.categoria,
        p.subcategoria,
        p.imagen,
        p.url,
        pr.precio,
        pr.precio_por_unidad,
        CAST(SUBSTRING_INDEX(n.valor_energetico, '/', -1) AS UNSIGNED) AS calorias,
        CAST(n.proteinas AS DECIMAL(10,2)) AS proteinas,
        CAST(n.hidratos_carbono AS DECIMAL(10,2)) AS hidratos_carbono,
        CAST(n.grasas AS DECIMAL(10,2)) AS grasas,
        CAST(n.azucares AS DECIMAL(10,2)) AS azucares
      FROM producto p
      LEFT JOIN (
        SELECT pr1.*
        FROM precio pr1
        INNER JOIN (
          SELECT id_producto, MAX(fecha_actualizacion) AS max_fecha
          FROM precio
          GROUP BY id_producto
        ) pr2 ON pr1.id_producto = pr2.id_producto AND pr1.fecha_actualizacion = pr2.max_fecha
      ) pr ON pr.id_producto = p.id_producto
      LEFT JOIN supermercado s ON s.id_supermercado = pr.id_supermercado
      LEFT JOIN nutricion n ON n.id_producto = p.id_producto
      WHERE pr.precio IS NOT NULL AND pr.precio <= ?
      ${supermercadoFiltro}
      ${nombreFiltro}
      ${orderBy}
      LIMIT ? OFFSET ?
    `;

    const values = [precioMax, ...superArray];
    if (searchTerm) values.push(`%${searchTerm}%`);
    values.push(limit, offset);

    const [results] = await db.query(query, values);
    res.json(results);
  } catch (err) {
    console.error("Error en /api/productos:", err);
    res.status(500).json({
      error: "Error al obtener productos",
      message: err.message,
      code: err.code,
    });
  }
});

// RUTA DE REGISTRO — FUNCIONA CON TABLA `usuario`
app.post("/register", async (req, res) => {
  const { nombre, apellido1, apellido2, email, password, birthdate } = req.body;

  try {
    const [existing] = await db.query("SELECT * FROM usuario WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }

    const hashed = await bcrypt.hash(password, 10);
    await db.query(`
      INSERT INTO usuario (nombre, apellido1, apellido2, email, pass, rol, fecha_creacion)
      VALUES (?, ?, ?, ?, ?, 'cliente', ?)
    `, [nombre, apellido1, apellido2, email, hashed, birthdate]);

    res.status(201).json({ message: "Registro exitoso" });
  } catch (err) {
    console.error("Error en /register:", err);
    res.status(500).json({ error: "Error en el registro", message: err.message });
  }
});

// RUTA AÑADIR FAVORITOS
app.post("/api/favoritos/add", async (req, res) => {
  const { userId, productId } = req.body;

  if (!userId || !productId) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  try {
    // Comprobamos si ya existe
    const [exists] = await db.query(
      "SELECT * FROM favoritos WHERE id_usuario = ? AND id_producto = ?",
      [userId, productId]
    );

    if (exists.length > 0) {
      return res.status(200).json({ message: "Ya está en favoritos" });
    }

    await db.query(
      "INSERT INTO favoritos (id_usuario, id_producto) VALUES (?, ?)",
      [userId, productId]
    );

    res.status(201).json({ message: "Añadido a favoritos" });
  } catch (err) {
    console.error("Error al añadir a favoritos:", err);
    res.status(500).json({ error: "Error interno", message: err.message });
  }
});

// RUTA VER FAVORITOS
app.get("/api/favoritos/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId);

  if (!userId) {
    return res.status(400).json({ error: "ID de usuario no válido" });
  }

  try {
    const [favoritos] = await db.query(`
      SELECT 
        p.id_producto AS id,
        p.nombre,
        s.nombre AS supermercado,
        p.categoria,
        p.subcategoria,
        p.imagen,
        p.url,
        pr.precio,
        pr.precio_por_unidad AS precioUnidad
      FROM favoritos f
      JOIN producto p ON f.id_producto = p.id_producto
      LEFT JOIN (
        SELECT pr1.*
        FROM precio pr1
        INNER JOIN (
          SELECT id_producto, MAX(fecha_actualizacion) AS max_fecha
          FROM precio
          GROUP BY id_producto
        ) pr2 ON pr1.id_producto = pr2.id_producto AND pr1.fecha_actualizacion = pr2.max_fecha
      ) pr ON pr.id_producto = p.id_producto
      LEFT JOIN supermercado s ON pr.id_supermercado = s.id_supermercado
      WHERE f.id_usuario = ?
    `, [userId]);

    res.json(favoritos);
  } catch (err) {
    console.error("Error al obtener favoritos:", err);
    res.status(500).json({ error: "Error interno" });
  }
});

// RUTA BORRAR FAVORITO
app.delete("/api/favoritos/:userId/:productId", async (req, res) => {
  const { userId, productId } = req.params;

  try {
    const [result] = await db.query(
      "DELETE FROM favoritos WHERE id_usuario = ? AND id_producto = ?",
      [userId, productId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "El producto no estaba en favoritos" });
    }

    res.json({ message: "Producto eliminado de favoritos" });
  } catch (err) {
    console.error("Error al eliminar favorito:", err);
    res.status(500).json({ error: "Error interno" });
  }
});




app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
// RUTA DE LOGIN — NUEVA
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificamos si el usuario existe
    const [users] = await db.query("SELECT * FROM usuario WHERE email = ?", [email]);

    if (users.length === 0) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const user = users[0];

    // Comparamos la contraseña ingresada con la almacenada (hashed)
    const passwordMatch = await bcrypt.compare(password, user.pass);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    // Si todo va bien, respondemos con datos del usuario (sin contraseña)
    res.json({
      message: "Login exitoso",
      user: {
        id_usuario: user.id_usuario,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    });
  } catch (err) {
    console.error("Error en /login:", err);
    res.status(500).json({ error: "Error en el login", message: err.message });
  }
});



