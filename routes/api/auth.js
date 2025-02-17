const express = require("express");
const Joi = require("joi");
const User = require("../../models/User");
const authMiddleware = require("../../middlewares/auth");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json(error.details);
  }

  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email in use" });
    }

    const user = new User({ email, password });
    await user.save();

    return res.status(201).json({
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json(error.details);
  }

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const token = user.generateToken();
    await user.save();

    return res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/logout", authMiddleware, async (req, res) => {
  try {
    req.user.token = null;
    await req.user.save();
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/current", authMiddleware, (req, res) => {
  return res.status(200).json({
    email: req.user.email,
    subscription: req.user.subscription,
  });
});

module.exports = router;
