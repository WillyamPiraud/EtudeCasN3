const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  name: String,
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 8,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    enum: ["admin", "member"],
  },
  age: Number,
});

userSchema.pre("save", async function (next) {
  this.email = this.email.toLowerCase();

  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
