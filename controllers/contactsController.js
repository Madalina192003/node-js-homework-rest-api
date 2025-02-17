const Contact = require("../models/Contact");

exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createContact = async (req, res) => {
  const contact = new Contact(req.body);
  try {
    await contact.save();
    res.status(201).json(contact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateFavorite = async (req, res) => {
  const { contactId } = req.params;
  const { favorite } = req.body;

  if (favorite === undefined) {
    return res.status(400).json({ message: "missing field favorite" });
  }

  try {
    const contact = await Contact.findById(contactId);
    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }

    contact.favorite = favorite;
    await contact.save();
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
