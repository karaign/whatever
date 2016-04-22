import * as service from './post.service';

import {
  respond,
  handleError,
  checkEntity
} from '../util';

import HTTPError from 'node-http-error';
var {ValidationError} = require('mongoose').Error;

function checkUserRights(user) {
  return function(post) {
    if (post.author.equals(user._id) ||
        user.role === 'admin') {
      return post;
    } else {
      throw new HTTPError(403);
    }
  };
}

export function show(req, res, next) {
  service.getPost(req.params.id)
    .then(checkEntity())
    .then(respond(res))
    .catch(handleError(res));
}

export function create(req, res) {
  var data = req.body;
  data.author = req.user;
  service.createPost(data)
    .then(respond(res))
    .catch(ValidationError, handleError(res, 422))
    .catch(handleError(res));
}

export function edit(req, res) {
  service.getPost(req.params.id)
    .then(checkUserRights(req.user))
    .then(() => service.editPost(req.params.id, req.body))
    .then(respond(res))
    .catch(ValidationError, handleError(res, 422))
    .catch(handleError(res));
}

export function destroy(req, res) {
  service.deletePost(req.params.id)
    .then(respond(res, 204))
    .catch(handleError(res));
}

export function getFeed(req, res) {
  var page = Number(req.query.page);

  service.getFeed(req.user, page)
    .then(respond(res))
    .catch(handleError(res));
}

/**
 * Retrieves posts by a specific user.
 */
export function getByUser(req, res) {
  var name = req.params.name;
  var page = Number(req.query.page);

  service.getPostsByUserName(name, page)
    .then(checkEntity())
    .then(respond(res))
    .catch(handleError(res));
}

/**
 * Retrieves a single post by author and slug.
 */
export function getByUserAndSlug(req, res) {
  var name = req.params.name;
  var slug = req.params.slug;

  service.getPostByUserNameAndSlug(name, slug)
    .then(checkEntity())
    .then(respond(res))
    .catch(handleError(res));
}

/**
 * Finds posts by author, tags, and/or text content.
 */
export function search(req, res) {
  var page = Number(req.query.page);
  service.searchPosts(req.query, page)
    .then(respond(res))
    .catch(handleError(res));
}
