import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt-nodejs";

let UserProfileSchema  = new Schema({

  name: {
    type: String,
    trim: true,
    text: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true
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
module.exports = mongoose.model('UserProfileModel', UserProfileSchema);