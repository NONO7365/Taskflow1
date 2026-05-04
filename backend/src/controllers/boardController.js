const BoardModel = require("../models/boardModel");
const ColumnModel = require("../models/columnModel");
const CardModel = require("../models/cardModel");

const boardController = {
  // GET /api/boards
  async getAll(req, res) {
    try {
      const boards = await BoardModel.findAllByUser(req.user.id);
      res.json(boards);
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  },

  // GET /api/boards/:id
  async getOne(req, res) {
    try {
      const board = await BoardModel.findById(req.params.id);
      if (!board) {
        return res.status(404).json({ error: "Tableau introuvable" });
      }
      res.json(board);
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  },

  // POST /api/boards
  async create(req, res) {
    try {
      const { title } = req.body;
      if (!title) {
        return res.status(400).json({ error: "Le titre est requis" });
      }
      const board = await BoardModel.create({ title, userId: req.user.id });
      res.status(201).json(board);
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  },

  // DELETE /api/boards/:id
  async delete(req, res) {
    try {
      await BoardModel.delete(req.params.id);
      res.json({ message: "Tableau supprimé" });
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  },

  // POST /api/boards/:id/columns
  async createColumn(req, res) {
    try {
      const { title } = req.body;
      if (!title) {
        return res.status(400).json({ error: "Le titre est requis" });
      }
      const position = await ColumnModel.countByBoard(req.params.id);
      const column = await ColumnModel.create({
        title,
        position,
        boardId: req.params.id,
      });
      res.status(201).json(column);
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  },

  // POST /api/columns/:id/cards
  async createCard(req, res) {
    try {
      const { title, description } = req.body;
      if (!title) {
        return res.status(400).json({ error: "Le titre est requis" });
      }
      const position = await CardModel.countByColumn(req.params.id);
      const card = await CardModel.create({
        title,
        description,
        position,
        columnId: req.params.id,
      });
      res.status(201).json(card);
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  },

  // PUT /api/cards/:id
  async updateCard(req, res) {
    try {
      const { title, description } = req.body;
      if (!title) {
        return res.status(400).json({ error: "Le titre est requis" });
      }
      const card = await CardModel.update(req.params.id, {
        title,
        description,
      });
      res.json(card);
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  },

  // DELETE /api/cards/:id
  async deleteCard(req, res) {
    try {
      await CardModel.delete(req.params.id);
      res.json({ message: "Carte supprimée" });
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  },
};

module.exports = boardController;
