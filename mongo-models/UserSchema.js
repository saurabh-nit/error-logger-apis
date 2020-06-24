let mongoose = require("mongoose");
let bcrypt = require("bcrypt-nodejs");
const uuidv1 = require('uuid/v1');

let UserProfileSchema  = new mongoose.Schema({

  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: true,
    index: true
  },
  password: {
    type: String,
    trim: true
  },
  app_id: {
    type: String,
    trim: true
  }
});


// Save user's hashed password
UserProfileSchema.pre('save', function (next) {
  let user = this;
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, function () {

      }, function (err, hash) {
        if (err) {
          return next(err);
        }
        // saving actual password as hash
        user.password = hash;
        user.app_id =  uuidv1()
        next();
      });
    });
  } else {
    return next();
  }
});

// compare two passwords
UserProfileSchema.methods.comparePassword = function (pw, cb) {
  bcrypt.compare(pw, this.password, function (err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

// UserProfileSchema.index({email: 1}, {unique: true});
module.exports = mongoose.model('UserProfileModel', UserProfileSchema);