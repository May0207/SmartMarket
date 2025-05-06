const express = require('express');
const cors = require('cors');
const productosRouter = require('./routes/productos');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', productosRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
