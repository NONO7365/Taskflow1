const express = require("express");
const router = express.Router();
const boardController = require("../controllers/boardController");
const authMiddleware = require("../middlewares/authMiddleware");

// Toutes les routes sont protégées par le middleware JWT
router.use(authMiddleware);

router.get("/", boardController.getAll);
router.get("/:id", boardController.getOne);
router.post("/", boardController.create);
router.delete("/:id", boardController.delete);
router.post("/:id/columns", boardController.createColumn);
router.post("/columns/:id/cards", boardController.createCard);
router.put("/cards/:id", boardController.updateCard);
router.delete("/cards/:id", boardController.deleteCard);
router.patch("/cards/:id/move", boardController.moveCard);

module.exports = router;
