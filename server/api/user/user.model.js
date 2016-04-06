import crypto from 'crypto';
import mongoose from 'mongoose';

var UserSchema = new mongoose.Schema({
  name: {
    type: String,
    lowercase: true,
    trim: true,
    match: /[0-9a-z_\.]+/i,
    minlength: 5,
    maxlength: 30,
    required: true,
    unique: true
  },
  displayName: {
    type: String,
    maxlength: 30
  },
  avatar: {
    type: String,
    default: '/assets/images/avatar.png'
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    match: /.+@.+\..+/i,
    required: true,
    unique: true
  },
  role: {
    type: String,
    default: 'user'
  },
  about: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    required: true,
    minlength: 4
  },
  following: [{
    type: mongoose.Schema.ObjectId, ref: 'User'
  }],
  provider: String,
  salt: String
});

UserSchema.plugin(require('mongoose-unique-validator'));

/**
 * Virtuals
 */

// Public profile information
UserSchema
  .virtual('profile')
  .get(function() {
    return {
      '_id': this._id,
      'avatar': this.avatar,
      'name': this.name,
      'displayName': this.displayName,
      'role': this.role,
      'about': this.about
    };
  });

// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(function() {
    return {
      '_id': this._id,
      'role': this.role
    };
  });

var validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function(next) {
    // Handle new/update passwords
    if (!this.isModified('password')) {
      return next();
    }

    if (!validatePresenceOf(this.password)) {
      next(new Error('Invalid password'));
    }

    // Make salt with a callback
    this.makeSalt((saltErr, salt) => {
      if (saltErr) {
        next(saltErr);
      }
      this.salt = salt;
      this.encryptPassword(this.password, (encryptErr, hashedPassword) => {
        if (encryptErr) {
          next(encryptErr);
        }
        this.password = hashedPassword;
        next();
      });
    });
  });

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} password
   * @param {Function} callback
   * @return {Boolean}
   * @api public
   */
  authenticate(password, callback) {
    if (!callback) {
      return this.password === this.encryptPassword(password);
    }

    this.encryptPassword(password, (err, pwdGen) => {
      if (err) {
        return callback(err);
      }

      if (this.password === pwdGen) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    });
  },

  /**
   * Make salt
   *
   * @param {Number} byteSize Optional salt byte size, default to 16
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  makeSalt(byteSize, callback) {
    var defaultByteSize = 16;

    if (typeof arguments[0] === 'function') {
      callback = arguments[0];
      byteSize = defaultByteSize;
    } else if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    }

    if (!byteSize) {
      byteSize = defaultByteSize;
    }

    if (!callback) {
      return crypto.randomBytes(byteSize).toString('base64');
    }

    return crypto.randomBytes(byteSize, (err, salt) => {
      if (err) {
        callback(err);
      } else {
        callback(null, salt.toString('base64'));
      }
    });
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  encryptPassword(password, callback) {
    if (!password || !this.salt) {
      return null;
    }

    var defaultIterations = 10000;
    var defaultKeyLength = 64;
    var salt = new Buffer(this.salt, 'base64');

    if (!callback) {
      return crypto.pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength)
                   .toString('base64');
    }

    return crypto.pbkdf2(password, salt, defaultIterations, defaultKeyLength, (err, key) => {
      if (err) {
        callback(err);
      } else {
        callback(null, key.toString('base64'));
      }
    });
  },

  /**
   * Find the user's followers
   *
   * @return {Promise}
   * @api public
   */
  findFollowers() {
    return this.model('User').find({following: this});
  },

  /**
   * Get the number of the user's followers and those followed by the use
   *
   * @return {Promise}
   * @api public
   */
  getFollowerStats() {
    return this.model('User').count({following: this})
      .then(count => ({
        'followers': count,
        'following': this.following.length
      }));
  },
  /**
   * Attaches follower stats to profile and resolves a promise with i
   *
   * @return {Promise}
   * @api public
   */
  getProfileAsync() {
    return this.getFollowerStats()
      .then(stats => {
        var profile = this.profile;
        profile.stats = stats;
        return profile;
      });
  }
};

export default mongoose.model('User', UserSchema);
