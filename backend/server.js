const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const db = require("./db");
const axios = require("axios");
require("dotenv").config(); 
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
    const searchTerm = req.query.search || "";
    const nutritionField = req.query.nutritionField;
    const nutritionOrder = req.query.nutritionOrder;

    const validFields = [
      "calorias",
      "proteinas",
      "grasas",
      "hidratos_carbono",
      "azucares",
    ];

    let orderBy = "ORDER BY p.id_producto ASC";
    if (nutritionField && validFields.includes(nutritionField)) {
      orderBy = `
        ORDER BY 
          CASE 
            WHEN ${nutritionField} IS NULL OR ${nutritionField} = 0 THEN 1 
            ELSE 0 
          END ASC,
          ${nutritionField} ${nutritionOrder === "asc" ? "ASC" : "DESC"}
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
    const [existing] = await db.query("SELECT * FROM usuario WHERE email = ?", [
      email,
    ]);
    if (existing.length > 0) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }

    const hashed = await bcrypt.hash(password, 10);
    await db.query(
      `
      INSERT INTO usuario (nombre, apellido1, apellido2, email, pass, rol, fecha_creacion)
      VALUES (?, ?, ?, ?, ?, 'cliente', ?)
    `,
      [nombre, apellido1, apellido2, email, hashed, birthdate]
    );

    res.status(201).json({ message: "Registro exitoso" });
  } catch (err) {
    console.error("Error en /register:", err);
    res
      .status(500)
      .json({ error: "Error en el registro", message: err.message });
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
    const [favoritos] = await db.query(
      `
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
    `,
      [userId]
    );

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
      return res
        .status(404)
        .json({ message: "El producto no estaba en favoritos" });
    }

    res.json({ message: "Producto eliminado de favoritos" });
  } catch (err) {
    console.error("Error al eliminar favorito:", err);
    res.status(500).json({ error: "Error interno" });
  }
});

app.put("/usuarios/:id", async (req, res) => {
  const id = req.params.id;
  const { nombre, apellido1, apellido2, email, password } = req.body;

  try {
    // Preparamos la consulta SQL dinámicamente
    let sql = `
      UPDATE usuario
      SET nombre = ?, apellido1 = ?, apellido2 = ?, email = ?
    `;
    const values = [nombre, apellido1, apellido2, email];

    // Si hay contraseña, la hasheamos y la incluimos
    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      sql += `, pass = ?`;
      values.push(hashedPassword);
    }

    sql += ` WHERE id_usuario = ?`;
    values.push(id);

    // Ejecutamos la consulta
    const [result] = await db.query(sql, values);

    res.json({ message: "Usuario actualizado correctamente" });
  } catch (err) {
    console.error("Error al actualizar usuario:", err);
    res.status(500).json({
      error: "Error al actualizar usuario",
      message: err.message,
    });
  }
});

app.get("/usuarios", async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id_usuario, nombre, apellido1, apellido2, email, rol FROM usuario"
    );
    res.json(users);
  } catch (err) {
    console.error("Error al obtener usuarios:", err);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

app.put("/usuarios/:id/rol", async (req, res) => {
  const id = req.params.id;
  const { rol } = req.body;

  try {
    const [result] = await db.query(
      "UPDATE usuario SET rol = ? WHERE id_usuario = ?",
      [rol, id]
    );

    res.json({ message: "Rol actualizado correctamente" });
  } catch (err) {
    console.error("Error al actualizar rol:", err);
    res
      .status(500)
      .json({ error: "Error al actualizar rol", detail: err.message });
  }
});

app.delete("/usuarios/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Primero elimina los favoritos
    await db.query("DELETE FROM favoritos WHERE id_usuario = ?", [id]);

    // Luego elimina el usuario
    const [result] = await db.query(
      "DELETE FROM usuario WHERE id_usuario = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario y sus favoritos eliminados correctamente" });
  } catch (err) {
    console.error("Error al eliminar usuario:", err);
    res
      .status(500)
      .json({ error: "Error al eliminar usuario", detail: err.message });
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
    const [users] = await db.query("SELECT * FROM usuario WHERE email = ?", [
      email,
    ]);

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
        rol: user.rol,
      },
    });
  } catch (err) {
    console.error("Error en /login:", err);
    res.status(500).json({ error: "Error en el login", message: err.message });
  }
});
app.get("/api/productos/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  if (!id) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const query = `
      SELECT 
        p.id_producto AS id,
        p.nombre AS nombre,
        s.nombre AS supermercado,
        p.categoria,
        p.subcategoria,
        p.imagen,
        p.url,
        pr.precio,
        pr.precio_por_unidad AS precioUnidad,
       CAST(TRIM(SUBSTRING_INDEX(n.valor_energetico, '/', 1)) AS UNSIGNED) AS calorias,

  CAST(REPLACE(n.proteinas, ',', '.') AS DECIMAL(10,2)) AS proteinas,
CAST(REPLACE(n.hidratos_carbono, ',', '.') AS DECIMAL(10,2)) AS hidratos_carbono,
CAST(REPLACE(n.grasas, ',', '.') AS DECIMAL(10,2)) AS grasas,
CAST(REPLACE(n.azucares, ',', '.') AS DECIMAL(10,2)) AS azucares

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
      WHERE p.id_producto = ?
      LIMIT 1
    `;

    const [results] = await db.query(query, [id]);

    if (results.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(results[0]);
  } catch (err) {
    console.error("Error en /api/productos/:id:", err);
    res.status(500).json({
      error: "Error interno",
      detail: err.message,
    });
  }
});
// RUTA DE CHATBOT
app.post("/chatbot", async (req, res) => {
  const pregunta = req.body.mensaje;
  const userId = req.body.userId;

  if (!pregunta || !userId) {
    return res.status(400).json({ error: "Mensaje o usuario no proporcionado" });
  }

  try {
    // Obtener favoritos del usuario con valores nutricionales
    const [favoritos] = await db.query(
      `
      SELECT 
        p.nombre,
        p.categoria,
        p.subcategoria,
        n.proteinas,
        n.grasas,
        n.hidratos_carbono,
        n.azucares,
        CAST(TRIM(SUBSTRING_INDEX(n.valor_energetico, '/', 1)) AS UNSIGNED) AS calorias
      FROM favoritos f
      JOIN producto p ON f.id_producto = p.id_producto
      LEFT JOIN nutricion n ON n.id_producto = p.id_producto
      WHERE f.id_usuario = ?
      `,
      [userId]
    );

    if (favoritos.length === 0) {
      return res.json({ resultados: [], mensaje: "No tienes productos en favoritos aún." });
    }

    // Si tiene muchos favoritos, obligar a que mencione algunos
    const UMBRAL = 10;
    const productoNombres = favoritos.map(f => f.nombre.toLowerCase());

    let productosFiltrados = favoritos;

    if (favoritos.length > UMBRAL) {
      // Pedimos a GPT que nos diga si ha mencionado productos
      const extractResponse = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `Extrae solo los nombres de productos/ingredientes mencionados por el usuario (en minúsculas). Devuelve un JSON así: {"productos": ["atún", "arroz"]}. Si no hay ninguno, devuelve {"productos": []}.`
            },
            {
              role: "user",
              content: pregunta
            }
          ],
          temperature: 0,
          max_tokens: 100
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        }
      );

      const extraidos = JSON.parse(extractResponse.data.choices[0].message.content);
      const mencionados = extraidos.productos || [];

      if (mencionados.length === 0) {
        return res.json({
          resultados: [],
          mensaje: `Tienes muchos productos guardados. Por favor, indica con qué productos de tus favoritos quieres que haga la receta.`
        });
      }

      // Filtrar favoritos para que coincidan con los mencionados
      productosFiltrados = favoritos.filter(f =>
        mencionados.some(m => f.nombre.toLowerCase().includes(m))
      );

      if (productosFiltrados.length === 0) {
        return res.json({ resultados: [], mensaje: "Los productos que mencionaste no están en tus favoritos." });
      }
    }

    // Formatear productos con su información nutricional
    const listaFormateada = productosFiltrados.map(f => {
      return `${f.nombre} (Calorías: ${f.calorias || 0} kcal, Proteínas: ${f.proteinas || 0}g, Grasas: ${f.grasas || 0}g, Carbohidratos: ${f.hidratos_carbono || 0}g, Azúcares: ${f.azucares || 0}g)`;
    }).join('\n');

    // Generar la receta final
    const openaiResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `
Eres un chef nutricionista. Crea una receta usando solo los productos proporcionados. Si el usuario menciona una dieta (ej: keto, vegana, sin gluten), adáptala. Siempre añade una estimación nutricional final.

Formato:
---
Receta: ...  
Ingredientes: ...  
Preparación: ...  
Valores nutricionales:  
- Calorías: ...  
- Proteínas: ...  
- Grasas: ...  
- Carbohidratos: ...
---
            `
          },
          {
            role: "user",
            content: `Estos son mis productos disponibles:\n${listaFormateada}\nMi mensaje: ${pregunta}`
          }
        ],
        temperature: 0.5,
        max_tokens: 700
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const receta = openaiResponse.data.choices[0].message.content;
    res.json({ resultados: [], receta });

  } catch (err) {
    console.error("Error en /chatbot:", err.response?.data || err.message);
    res.status(500).json({ error: "Error al generar receta" });
  }
});
