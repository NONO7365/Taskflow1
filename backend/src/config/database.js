const {pool} = require('pg');
const pool  = new pool({
    connectionStrng: process.env.DATABASE_URL,
});

pool.connect()
.then(() => console.log ('Connecté à PostgreSQL ✓'))
    .catch((err) => console.error('Erreur de connexion DB:', err.message));


        module.exports = pool;

  