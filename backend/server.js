const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("API funcionando correctamente");
});

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

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
