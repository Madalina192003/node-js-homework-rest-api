const express = require("express");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const authMiddleware = require("../../middlewares/auth");

const router = express.Router();

// ✅ Înregistrare utilizator (Signup)
router.post("/signup", async (req, res) => {
  try {
    console.log("Cerere de signup primită:", req.body);

    const { email, password } = req.body;

    // ✅ Verificăm dacă email-ul există deja
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    // ✅ Creăm un nou utilizator și hash-uim parola
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });

    await newUser.save();

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    console.error("Eroare la signup:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Login utilizator
router.post("/login", async (req, res) => {
  try {
    console.log("Cerere de login primită:", req.body);

    const { email, password } = req.body;

    // ✅ Verificăm dacă utilizatorul există în baza de date
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    // ✅ Comparăm parola introdusă cu parola hash-uită din baza de date
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    // ✅ Generăm un token JWT
    const token = jwt.sign({ userId: user._id }, "secretKey", {
      expiresIn: "1h",
    });

    // ✅ Salvăm token-ul în baza de date
    user.token = token;
    await user.save();

    // ✅ Returnăm token-ul și informațiile utilizatorului
    res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    console.error("Eroare la login:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Obținerea datelor utilizatorului curent (protejat prin autentificare)
router.get("/current", authMiddleware, async (req, res) => {
  try {
    res.status(200).json({
      email: req.user.email,
      subscription: req.user.subscription,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Logout utilizator
router.get("/logout", authMiddleware, async (req, res) => {
  try {
    req.user.token = null;
    await req.user.save();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
