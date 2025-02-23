const fs = require("fs/promises");
const path = require("path");
const Jimp = require("jimp");

const User = require("../models/userModel");

const avatarsDir = path.join(__dirname, "../public/avatars");

const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { path: tempPath, filename } = req.file;
    const newFileName = `${req.user.id}-${Date.now()}.png`;
    const newPath = path.join(avatarsDir, newFileName);

    console.log("📂 Temp file path:", tempPath);
    console.log("📁 New file path:", newPath);

    // 🔧 Procesare imagine cu Jimp
    try {
      const image = await Jimp.read(tempPath);
      await image.resize(250, 250).writeAsync(newPath);
      console.log("🖼️ Image resized successfully");
    } catch (imageError) {
      console.error("❌ Error resizing image:", imageError);
      return res.status(500).json({ message: "Error processing image" });
    }

    // 🗑️ Șterge fișierul temporar
    try {
      await fs.unlink(tempPath);
      console.log("🗑️ Temp file deleted");
    } catch (unlinkError) {
      console.error("❌ Error deleting temp file:", unlinkError);
    }

    // 🔄 Actualizează avatarul în baza de date
    const avatarURL = `/avatars/${newFileName}`;
    await User.findByIdAndUpdate(req.user.id, { avatarURL });

    console.log("✅ Avatar updated successfully!");
    res.json({ avatarURL });
  } catch (err) {
    console.error("❌ General error processing avatar:", err);
    res.status(500).json({ message: "Error processing avatar" });
  }
};

module.exports = { updateAvatar };
