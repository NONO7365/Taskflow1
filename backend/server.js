const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./src/config/database");

const app = express();
const PORT = process.env.PORT || 3000;

//Middleware de base
app.use(cors());
app.use(express.json());

//Route de test
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Le serveur fonctionne correctement" });
});

//Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
