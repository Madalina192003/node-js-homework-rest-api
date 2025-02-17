const express = require("express");
const Contact = require("../../models/Contact");
const authMiddleware = require("../../middlewares/auth");

const router = express.Router();

// ✅ Obține toate contactele utilizatorului (cu paginare și filtrare)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20, favorite } = req.query;
    const query = { owner: req.user._id };

    if (favorite !== undefined) {
      query.favorite = favorite === "true";
    }

    const contacts = await Contact.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Contact.countDocuments(query);

    res.status(200).json({ total, contacts });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Adaugă un nou contact
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, email, phone, favorite } = req.body;
    const newContact = new Contact({
      name,
      email,
      phone,
      favorite,
      owner: req.user._id,
    });

    await newContact.save();
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Modifică un contact existent
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedContact = await Contact.findOneAndUpdate(
      { _id: id, owner: req.user._id },
      req.body,
      { new: true }
    );

    if (!updatedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Șterge un contact
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedContact = await Contact.findOneAndDelete({
      _id: id,
      owner: req.user._id,
    });

    if (!deletedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
