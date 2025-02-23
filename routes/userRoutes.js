const express = require("express");
const {
  getCurrentUser,
  updateAvatar,
} = require("../controllers/usersController");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.get("/current", authMiddleware, getCurrentUser);
router.patch("/avatars", authMiddleware, upload.single("avatar"), updateAvatar);

module.exports = router;
