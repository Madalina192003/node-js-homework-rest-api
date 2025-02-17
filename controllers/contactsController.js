const Contact = require("../models/Contact");

exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving contacts", error });
  }
};

exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: "Contact not found" });
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving contact", error });
  }
};

exports.addContact = async (req, res) => {
  try {
    const { name, email, phone, favorite } = req.body;
    const newContact = new Contact({ name, email, phone, favorite });
    await newContact.save();
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ message: "Error adding contact", error });
  }
};

exports.updateContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!contact) return res.status(404).json({ message: "Contact not found" });
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: "Error updating contact", error });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ message: "Contact not found" });
    res.json({ message: "Contact deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting contact", error });
  }
};

exports.updateFavoriteStatus = async (req, res) => {
  try {
    if (!req.body.favorite) {
      return res.status(400).json({ message: "Missing field favorite" });
    }
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { favorite: req.body.favorite },
      { new: true }
    );
    if (!contact) return res.status(404).json({ message: "Contact not found" });
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: "Error updating favorite status", error });
  }
};
