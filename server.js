require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const contactsRoutes = require("./routes/api/contacts");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/api/contacts", contactsRoutes);

mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Database connection successful");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err);
    process.exit(1);
  });
