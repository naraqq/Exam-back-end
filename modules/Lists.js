const mongoose = require("mongoose");
const List = mongoose.Schema({
  todo: {
    type: String,
  },
  time: { type: Date, default: Date.now },
});

module.exports = mongoose.model("list", List);
