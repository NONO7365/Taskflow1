const db = require("../config/database");

const CardModel = {
  // Créer une carte
  async create({ title, description, position, columnId }) {
    const result = await db.query(
      `INSERT INTO cards (title, description, position, column_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title, description || null, position, columnId],
    );
    return result.rows[0];
  },

  // Compter les cartes d'une colonne (pour la position)
  async countByColumn(columnId) {
    const result = await db.query(
      "SELECT COUNT(*) FROM cards WHERE column_id = $1",
      [columnId],
    );
    return parseInt(result.rows[0].count);
  },

  // Modifier une carte
  async update(id, { title, description }) {
    const result = await db.query(
      `UPDATE cards SET title = $1, description = $2
       WHERE id = $3
       RETURNING *`,
      [title, description || null, id],
    );
    return result.rows[0];
  },

  // Supprimer une carte
  async delete(id) {
    await db.query("DELETE FROM cards WHERE id = $1", [id]);
  },
};

module.exports = CardModel;
