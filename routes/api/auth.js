const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const { authMiddleware } = require("../../middlewares/auth");
const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (await User.findOne({ email }))
      return res.status(409).json({ message: "Email in use" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });

    res
      .status(201)
      .json({ user: { email: user.email, subscription: user.subscription } });
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: "Email or password is wrong" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    user.token = token;
    await user.save();

    res.status(200).json({
      token,
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;
