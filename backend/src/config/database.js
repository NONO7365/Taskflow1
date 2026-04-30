const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool
  .connect()
  .then(() => console.log("Connecté à PostgreSQL ✓"))
  .catch((err) => console.error("Erreur de connexion DB :", err.message));

module.exports = pool;
