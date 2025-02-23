const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

console.log("🔗 Available routes:");
app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(
      `${Object.keys(r.route.methods)[0].toUpperCase()} ${r.route.path}`
    );
  }
});

app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

module.exports = app;
