const express = require("express");
const {
  register,
  login,
  logout,
  verifyEmail,
  resendVerificationEmail,
} = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);
router.get("/verify/:verificationToken", verifyEmail);
router.post("/verify", resendVerificationEmail);

module.exports = router;
