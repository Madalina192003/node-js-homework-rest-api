const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Conectat la MongoDB!");
  } catch (error) {
    console.error("❌ Eroare la conectarea MongoDB:", error.message);
    process.exit(1); // Oprește aplicația dacă nu se poate conecta
  }
};

module.exports = connectDB;
