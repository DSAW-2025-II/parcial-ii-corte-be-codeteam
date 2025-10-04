require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const pokemonRoutes = require("./routes/pokemon");

const app = express();

// --- Configuración CORS ---
const FRONTEND_URL = process.env.FRONTEND_URL || "*";
app.use(express.json());
app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Ruta principal
app.get("/", (req, res) => {
  res.send("🚀 Backend desplegado correctamente en Render");
});

// --- Rutas ---
app.use("/api/v1", authRoutes);
app.use("/api/v1", pokemonRoutes);

// --- Levantar servidor ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
