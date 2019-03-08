var mongoose = require("mongoose");

let ErrorSchema = new mongoose.Schema({
  message: {
    type: String,
    trim: true
  },
  url: {
    type: String,
    trim: true
  },
  line: {
    type: String,
    trim: true
  },
  col: {
    type: String,
    trim: true
  },
  error: {
    type: String,
    trim: true
  }
});

module.exports = mongoose.model('ErrorModel', ErrorSchema);
