const db = require("../config/database");

const ColumnModel = {
  // Créer une colonne
  async create({ title, position, boardId }) {
    const result = await db.query(
      `INSERT INTO columns (title, position, board_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [title, position, boardId],
    );
    return result.rows[0];
  },

  // Compter les colonnes d'un tableau (pour la position)
  async countByBoard(boardId) {
    const result = await db.query(
      "SELECT COUNT(*) FROM columns WHERE board_id = $1",
      [boardId],
    );
    return parseInt(result.rows[0].count);
  },

  // Supprimer une colonne
  async delete(id) {
    await db.query("DELETE FROM columns WHERE id = $1", [id]);
  },
};

module.exports = ColumnModel;
