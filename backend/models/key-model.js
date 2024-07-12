const mongoose = require("mongoose");

const keySchema = new mongoose.Schema({
  user: {
    type: String,
    require: true,
  },
  keypart: {
    type: String,
    require: true,
  },
});

const Key = new mongoose.model("Key", keySchema);
module.exports = Key;
