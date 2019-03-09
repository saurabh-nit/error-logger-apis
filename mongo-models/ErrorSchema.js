let mongoose = require("mongoose");

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

ErrorSchema.index({ app_id: 1 }, {unique: true, name: "text"});
module.exports = mongoose.model('ErrorModel', ErrorSchema);
