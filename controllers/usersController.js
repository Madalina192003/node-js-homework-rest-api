const fs = require("fs/promises");
const path = require("path");
const Jimp = require("jimp");
const User = require("../models/userModel");

const avatarsDir = path.join(__dirname, "../public/avatars");

const updateAvatar = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Missing user data" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { path: tempPath } = req.file;
    const newFileName = `${req.user.id}-${Date.now()}.png`;
    const newPath = path.join(avatarsDir, newFileName);

    console.log("📂 Temp file path:", tempPath);
    console.log("📁 New file path:", newPath);

    try {
      const image = await Jimp.read(tempPath);
      await image.resize(250, 250).writeAsync(newPath);
      console.log("🖼️ Image resized successfully");
    } catch (imageError) {
      console.error("❌ Error resizing image:", imageError);
      return res.status(500).json({ message: "Error processing image" });
    }

    try {
      await fs.unlink(tempPath);
      console.log("🗑️ Temp file deleted");
    } catch (unlinkError) {
      console.error("❌ Error deleting temp file:", unlinkError);
    }

    const avatarURL = `/avatars/${newFileName}`;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { avatarURL },
      { new: true }
    );

    console.log("✅ Avatar updated successfully!");
    res.json({ avatarURL: updatedUser.avatarURL });
  } catch (err) {
    console.error("❌ General error processing avatar:", err);
    res.status(500).json({ message: "Error processing avatar" });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Missing user data" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      email: user.email,
      avatarURL: user.avatarURL,
    });
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { updateAvatar, getCurrentUser };
