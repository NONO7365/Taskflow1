const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Récupérer le token dans le header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token manquant" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // On attache l'utilisateur à la requête
    next(); // On passe à la suite
  } catch (error) {
    return res.status(401).json({ error: "Token invalide" });
  }
};

module.exports = authMiddleware;
