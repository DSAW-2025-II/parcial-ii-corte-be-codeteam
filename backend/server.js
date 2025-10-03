require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const pokemonRoutes = require('./routes/pokemon');

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || '*';

app.use(express.json());

app.use(cors({
  origin: FRONTEND_URL
}));

// ✅ Ruta principal
app.get("/", (req, res) => {
  res.send("Bienvenido al Parcial 🚀");
});

app.use('/api/v1', authRoutes);
app.use('/api/v1', pokemonRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
