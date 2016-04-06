import User from './user.model';
// import passport from 'passport';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';
import HTTPError from 'node-http-error';

import {
  respond,
  handleError,
  checkEntity
} from '../util';


/**
 * Get list of users
 * restriction: 'admin'
 */
export function index(req, res) {
  User.find({})
    .select('-salt -password').exec()
    .then(respond(res))
    .catch(handleError(res));
}

/**
 * Creates a new user
 */
export function create(req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save()
    .spread(function(user) {
      var token = jwt.sign({ _id: user._id }, config.secrets.session, {
        expiresIn: 60 * 60 * 5
      });
      res.json({ token });
    })
    .then(respond(res, 201))
    .catch(handleError(res, 422));
}


/**
 * Get a single user by name
 */
export function getByName(req, res) {
  var name = req.params.name;

  User.findOne({name}).exec()
    .then(checkEntity())
    .then(user => user.getProfileAsync())
    .then(respond(res))
    .catch(handleError(res));
}

/**
 * Get a single user
 */
export function show(req, res, next) {
  var userId = req.params.id;

  User.findById(userId).exec()
    .then(checkEntity())
    .then(user => user.getProfileAsync())
    .then(respond(res))
    .catch(handleError(res));
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
export function destroy(req, res) {
  User.findByIdAndRemove(req.params.id).exec()
    .then(respond(res, 204))
    .catch(handleError(res));
}

/**
 * Change a users password
 */
export function changePassword(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId).exec()
    .then(user => {
      if (user.authenticate(oldPass)) {
        user.password = newPass;
        return user.save();
      } else {
        throw new HTTPError(403);
      }
    })
    .then(respond(res, 204))
    .catch(handleError(res, 422));
}

/**
 * Get my info
 */
export function me(req, res, next) {
  var userId = req.user._id;

  User.findById(userId)
    .select('-salt -password').exec() // don't ever give out the password or salt
    .then(checkEntity(401))
    .then(respond(res))
    .catch(err => next(err));
}

/**
 * Authentication callback
 */
export function authCallback(req, res, next) {
  res.redirect('/');
}

/**
 * Follow a user
 */
export function followUser(req, res) {
  var followedId = req.params.id;

  if (req.user._id.equals(followedId)) {
    return respond(res, 422)();
  }

  req.user.following.addToSet(followedId);
  req.user.save()
    .then(() => User.findById(followedId).exec())
    .then(user => user.getProfileAsync())
    .then(respond(res))
    .catch(handleError(res));
}

/**
 * Stop following a user
 */
export function unfollowUser(req, res) {
  var followedId = req.params.id;

  req.user.following.remove(followedId);
  req.user.save()
    .then(() => User.findById(followedId).exec())
    .then(user => user.getProfileAsync())
    .then(respond(res))
    .catch(handleError(res));
}

/**
 * Get a list of a user's followers
 */
export function getFollowers(req, res) {
  var userId = req.params.id;

  User.findById(userId).exec()
    .then(checkEntity())
    .then(user => user.findFollowers())
    .then(followers => followers.map(f => f.profile))
    .then(respond(res))
    .catch(handleError(res));
}

/**
 * Get a list of those followed by a user
 */
export function getFollowing(req, res) {
  var userId = req.params.id;

  User.findById(userId)
    .populate('following')
    .exec()
    .then(checkEntity())
    .then(user => {
      return user.following.map(f => f.profile);
    })
    .then(respond(res))
    .catch(handleError(res));
}
