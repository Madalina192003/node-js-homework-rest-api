const express = require("express");
const fs = require("fs/promises");
const path = require("path");
const Joi = require("joi");

let nanoid;
import("nanoid").then(({ nanoid: importedNanoid }) => {
  nanoid = importedNanoid;
});

const router = express.Router();
const contactsPath = path.join(__dirname, "../../contacts.json");

const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

async function listContacts() {
  const data = await fs.readFile(contactsPath, "utf-8");
  return JSON.parse(data);
}

async function getById(id) {
  const contacts = await listContacts();
  return contacts.find((contact) => contact.id === id) || null;
}

async function addContact({ name, email, phone }) {
  const contacts = await listContacts();
  const newContact = { id: nanoid(), name, email, phone };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
}

async function removeContact(id) {
  let contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === id);
  if (index === -1) return null;
  contacts = contacts.filter((contact) => contact.id !== id);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return true;
}

async function updateContact(id, body) {
  let contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === id);
  if (index === -1) return null;
  contacts[index] = { ...contacts[index], ...body };
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[index];
}

router.get("/", async (req, res) => {
  const contacts = await listContacts();
  res.status(200).json(contacts);
});

router.get("/:contactId", async (req, res) => {
  const contact = await getById(req.params.contactId);
  if (!contact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.status(200).json(contact);
});

router.post("/", async (req, res) => {
  const { error } = contactSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  const newContact = await addContact(req.body);
  res.status(201).json(newContact);
});

router.delete("/:contactId", async (req, res) => {
  const success = await removeContact(req.params.contactId);
  if (!success) {
    return res.status(404).json({ message: "Not found" });
  }
  res.status(200).json({ message: "Contact deleted" });
});

router.put("/:contactId", async (req, res) => {
  if (!Object.keys(req.body).length) {
    return res.status(400).json({ message: "Missing fields" });
  }
  const updatedContact = await updateContact(req.params.contactId, req.body);
  if (!updatedContact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.status(200).json(updatedContact);
});

module.exports = router;
