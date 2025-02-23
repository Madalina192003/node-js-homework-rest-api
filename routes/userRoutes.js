const express = require("express");
const { updateAvatar } = require("../controllers/usersController");

const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.patch("/avatars", authMiddleware, upload.single("avatar"), updateAvatar);

module.exports = router;
