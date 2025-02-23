const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const sendEmail = require("../helpers/sendEmail");

const getNanoid = async () => {
  const { nanoid } = await import("nanoid");
  return nanoid;
};

const register = async (req, res) => {
  try {
    const nanoid = await getNanoid();
    const verificationToken = nanoid();

    console.log("Token generat:", verificationToken);
  } catch (error) {
    console.error("❌ Eroare la generarea tokenului:", error);
    res.status(500).json({ message: "Eroare la înregistrare" });
  }
};

const login = async (req, res) => {};

const logout = async (req, res) => {};

const verifyEmail = async (req, res) => {};

const resendVerificationEmail = async (req, res) => {};

module.exports = {
  register,
  login,
  logout,
  verifyEmail,
  resendVerificationEmail,
};
