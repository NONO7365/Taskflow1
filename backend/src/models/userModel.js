const db = require("../config/database");

const UserModel = {
  // Créer un utilisateur
  async create({ name, email, password }) {
    const result = await db.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [name, email, password],
    );
    return result.rows[0];
  },

  // Trouver un utilisateur par email
  async findByEmail(email) {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  },

  // Trouver un utilisateur par id
  async findById(id) {
    const result = await db.query(
      "SELECT id, name, email, created_at FROM users WHERE id = $1",
      [id],
    );
    return result.rows[0];
  },
};

module.exports = UserModel;
