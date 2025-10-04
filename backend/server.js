require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const fetch = require("node-fetch");

const app = express();

// --- Configuración CORS ---
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*", // acepta tu frontend de Vercel
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// --- Ruta principal ---
app.get("/", (req, res) => {
  res.send("✅ Backend desplegado correctamente en Render 🚀");
});

// --- Middleware de autenticación ---
function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(403).json({ error: "User not authenticated" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "User not authenticated" });
    req.user = user;
    next();
  });
}

// --- Login ---
app.post("/api/v1/auth", (req, res) => {
  const { email, password } = req.body;
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASS) {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    });
    return res.status(200).json({ token });
  } else {
    return res.status(400).json({ error: "Invalid credentials" });
  }
});

// --- Endpoint protegido Pokémon ---
app.post("/api/v1/pokemonDetails", authMiddleware, async (req, res) => {
  const { pokemonName } = req.body;
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`
    );
    if (!response.ok) {
      return res.status(400).json({ error: "Pokémon no encontrado" });
    }

    const data = await response.json();
    return res.status(200).json({
      name: data.name,
      species: data.species.name,
      weight: data.weight,
      img_url: data.sprites.front_default,
    });
  } catch (err) {
    return res.status(500).json({ error: "Error obteniendo Pokémon" });
  }
});

// --- Servidor ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));

