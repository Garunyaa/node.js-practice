const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/items", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const itemSchema = new mongoose.Schema({
  id: Number,
  name: String,
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
