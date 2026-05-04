const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");

const authController = {
  // Inscription
  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      // Vérification des champs
      if (!name || !email || !password) {
        return res.status(400).json({ error: "Tous les champs sont requis" });
      }

      // Vérifier si l'email existe déjà
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "Cet email est déjà utilisé" });
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Créer l'utilisateur
      const user = await UserModel.create({
        name,
        email,
        password: hashedPassword,
      });

      // Générer le token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN },
      );

      res.status(201).json({ user, token });
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  },

  // Connexion
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Vérification des champs
      if (!email || !password) {
        return res.status(400).json({ error: "Email et mot de passe requis" });
      }

      // Trouver l'utilisateur
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Identifiants incorrects" });
      }

      // Vérifier le mot de passe
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Identifiants incorrects" });
      }

      // Générer le token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN },
      );

      res.json({
        user: { id: user.id, name: user.name, email: user.email },
        token,
      });
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  },
};

module.exports = authController;
