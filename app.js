const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // Servirea fișierelor statice

// Rutele principale
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

module.exports = app;
