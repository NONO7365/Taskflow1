const db = require("../config/database");

const BoardModel = {
  // Récupérer tous les tableaux d'un utilisateur
  async findAllByUser(userId) {
    const result = await db.query(
      `SELECT * FROM boards WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId],
    );
    return result.rows;
  },

  // Récupérer un tableau avec ses colonnes et cartes
  async findById(id) {
    const result = await db.query(
      `SELECT 
        b.id, b.title, b.created_at,
        json_agg(
          json_build_object(
            'id', c.id,
            'title', c.title,
            'position', c.position,
            'cards', (
              SELECT json_agg(
                json_build_object(
                  'id', ca.id,
                  'title', ca.title,
                  'description', ca.description,
                  'position', ca.position
                ) ORDER BY ca.position
              )
              FROM cards ca WHERE ca.column_id = c.id
            )
          ) ORDER BY c.position
        ) AS columns
      FROM boards b
      LEFT JOIN columns c ON c.board_id = b.id
      WHERE b.id = $1
      GROUP BY b.id`,
      [id],
    );
    return result.rows[0];
  },

  // Créer un tableau
  async create({ title, userId }) {
    const result = await db.query(
      `INSERT INTO boards (title, user_id) 
       VALUES ($1, $2) 
       RETURNING *`,
      [title, userId],
    );
    return result.rows[0];
  },

  // Supprimer un tableau
  async delete(id) {
    await db.query("DELETE FROM boards WHERE id = $1", [id]);
  },
};

module.exports = BoardModel;
