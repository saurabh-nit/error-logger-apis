let mongoose = require("mongoose");

let ErrorSchema = new mongoose.Schema({
  msg: {
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
    type: Object,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserProfileModel'
  },
  app_id: {
    type: String,
    trim: true
  }
});

module.exports = mongoose.model('ErrorModel', ErrorSchema);
