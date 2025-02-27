const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Usuario de MySQL (por defecto en XAMPP)
  password: '',  // Contraseña de MySQL (vacía por defecto en XAMPP)
  database: 'supermercado'
});

db.connect(err => {
  if (err) {
    console.error('Error conectando a la BD:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

// Registro de usuario con validación de edad
app.post('/register', async (req, res) => {
  const { email, password, birthdate } = req.body;

  // Verificar si el usuario es mayor de 18 años
  const birthDate = new Date(birthdate);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  if (age < 18 || (age === 18 && today < new Date(birthDate.setFullYear(today.getFullYear())))) {
    return res.status(400).json({ message: 'Debes ser mayor de 18 años para registrarte' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query(
      'INSERT INTO usuarios (email, password, birthdate, role) VALUES (?, ?, ?, "cliente")',
      [email, hashedPassword, birthdate],
      (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Usuario registrado exitosamente' });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login de usuario
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.length === 0) return res.status(400).json({ message: 'Usuario no encontrado' });

    const user = results[0];

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(400).json({ message: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: user.id, role: user.role }, 'secreto', { expiresIn: '1h' });

    res.json({ token, role: user.role });
  });
});

// Iniciar servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
