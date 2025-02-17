const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/api/auth");
const contactRoutes = require("./routes/api/contacts");

const app = express();

app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/authAPI", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/users", authRoutes);
app.use("/contacts", contactRoutes);

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
