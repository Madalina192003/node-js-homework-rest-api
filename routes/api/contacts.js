const express = require("express");
const Contact = require("../../models/Contact");
const authMiddleware = require("../../middlewares/auth");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const contact = new Contact({
      ...req.body,
      owner: req.user._id,
    });

    await contact.save();
    return res.status(201).json(contact);
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const contacts = await Contact.find({ owner: req.user._id });
    return res.status(200).json(contacts);
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
