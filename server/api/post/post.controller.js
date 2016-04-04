'use strict';

import Post from './post.model';
import User from '../user/user.model';

import HTTPError from 'node-http-error';
import {mapValues} from 'lodash';

import {
  respond,
  handleError,
  checkEntity,
  removeEntity,
  saveUpdates
} from '../util'

/**
 * Returns a function that throws 403 (Forbidden) error
 * if the user isn't an admin or the post's author.
 */
function checkUserRights(user) {
  return function(post) {
    if (post.author.equals(user._id) ||
        user.role === 'admin') {
      return post;
    } else {
      throw new HTTPError(403);
    }
  }
}


/**
 * Retrieves a user's personal feed.
 */
export function getFeed(req, res) {
    var page = Number(req.query.page)

    Post.paginate({author: {$in: req.user.following}}, {
      page, populate: 'author'
    })
    .then(respond(res))
    .catch(handleError(res))
}

/**
 * Retrieves posts by a specific user.
 */
export function getByUser (req, res) {
  var name = req.params.name;
  var page = Number(req.query.page);

  User.findOne({name}).exec()
    .then(checkEntity())
    .then(author => Post.paginate({author}, {page}))
    .then(respond(res))
    .catch(handleError(res));
}

/**
 * Retrieves a single post by author and slug.
 */
export function getByUserAndSlug(req, res) {
  var slug = req.params.slug;

  User.findOne({name: req.params.name}).exec()
    .then(checkEntity())
    .then(author =>
      Post.findOne({author, slug})
      .populate('author')
      .exec()
    )
    .then(checkEntity())
    .then(respond(res))
    .catch(handleError(res));
}

/**
 * Retrieves newest posts by all users.
 */
export function getNewest(req, res) {
  const count = 5;
  Post.find()
    .populate('author')
    .select('-body -comments')
    .sort({date: 'descending'})
    .limit(count)
    .exec()
    .then(respond(res))
    .catch(handleError(res));
}

/**
 * Finds posts by name, contents and/or tags.
 */
export function search(req, res) {
  var qs = req.query;
  var page = Number(qs.page);
  var query = {};

  if (qs.tags) {
    query.tags = {$in: qs.tags.split(',')};
  }
  if (qs.title) {
    query.title = {$text: {$search: qs.title}};
  }
  if (qs.body) {
    query.body = {$text: {$search: qs.body}};
  }

  Post.paginate(query, {page, populate: 'author'})
    .then(respond(res))
    .catch(handleError(res));
}

/**
 * Retrieves a single post.
 */
export function show(req, res) {
  Post.findById(req.params.id).exec()
    .then(checkEntity())
    .then(respond(res))
    .catch(handleError(res));
}

/**
 * Creates a new post.
 */
export function create(req, res) {
  var post = new Post(req.body);
  post.author = req.user;
  post.date = Date.now();
  post.save()
    .then(respond(res, 201))
    .catch(handleError(res));
}

// Updates an existing Post in the DB
export function edit(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Post.findById(req.params.id).exec()
    .then(checkEntity())
    .then(checkUserRights(req.user))
    .then(saveUpdates(req.body))
    .then(respond(res))
    .catch(handleError(res));
}

// Deletes a Post from the DB
export function destroy(req, res) {
  Post.findById(req.params.id).exec()
    .then(checkEntity())
    .then(checkUserRights(req.user))
    .then(removeEntity())
    .then(respond(res, 204))
    .catch(handleError(res));
}
