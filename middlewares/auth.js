const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // ✅ Extragem token-ul din header
    const token = authorization.split(" ")[1];

    // ✅ Verificăm dacă token-ul este valid
    const decoded = jwt.verify(token, "secretKey");
    const user = await User.findById(decoded.userId);

    if (!user || user.token !== token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // ✅ Salvăm user-ul în `req.user` pentru a fi accesibil în alte rute
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized" });
  }
};

module.exports = authMiddleware;
