const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./src/config/database");
const authRoutes = require("./src/routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

const boardRoutes = require("./src/routes/boardRoutes");

//Middleware de base
//app.use(cors());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use("/api/boards", boardRoutes);
//Route de test
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Le serveur fonctionne correctement" });
});

const authMiddleware = require("./src/middlewares/authMiddleware");

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: `Bonjour, tu es connecté en tant que user id: ${req.user.id}`,
  });
});

//Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
