import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  department: String,
  year: Number,
});

export const User = mongoose.model("User", userSchema);
