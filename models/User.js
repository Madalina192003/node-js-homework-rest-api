const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: { type: String, default: null },
});

const User = model("User", userSchema);
module.exports = User;
