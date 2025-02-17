const express = require("express");
const router = express.Router();
const contactsController = require("../../controllers/contactsController");

router.get("/", contactsController.getAllContacts);

router.post("/", contactsController.createContact);

router.patch("/:contactId/favorite", contactsController.updateFavorite);

module.exports = router;
