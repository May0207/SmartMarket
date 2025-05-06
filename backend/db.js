const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'admin',          // Asegúrate que este usuario tenga privilegios
  password: 'Admin123!',  // Usa la misma contraseña en toda la app
  database: 'supermercados',
  port: 3307,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Verificación de conexión al iniciar
pool.getConnection()
  .then(conn => {
    console.log('✅ Conexión a MySQL establecida');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Error de conexión:', err);
    process.exit(1); // Termina la aplicación si no puede conectar
  });

module.exports = pool;