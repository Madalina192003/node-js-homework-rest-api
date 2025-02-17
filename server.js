require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const contactsRoutes = require("./routes/api/contacts");

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());

mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connection successful"))
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });

app.use("/api/contacts", contactsRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
