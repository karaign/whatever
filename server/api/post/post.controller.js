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

export function like(req, res) {
  service.likePost(req.params.id, req.user)
    .then(checkEntity())
    .then(respond(res))
    .catch(handleError(res));
}


export function unlike(req, res) {
  service.unlikePost(req.params.id, req.user)
    .then(checkEntity())
    .then(respond(res))
    .catch(handleError(res));
}

export function getResponses(req, res) {
  var page = Number(req.query.page);

  service.getResponsesTo(req.params.id, page)
    .then(checkEntity())
    .then(respond(res))
    .catch(handleError(res));
}

export function getFeed(req, res) {
  var page = Number(req.query.page);

  service.getFeed(req.user, page)
    .then(respond(res))
    .catch(handleError(res));
}

export function getByUser(req, res) {
  var name = req.params.name;
  var page = Number(req.query.page);

  service.getPostsByUserName(name, page)
    .then(checkEntity())
    .then(respond(res))
    .catch(handleError(res));
}

export function getByUserAndSlug(req, res) {
  var name = req.params.name;
  var slug = req.params.slug;

  service.getPostByUserNameAndSlug(name, slug)
    .then(checkEntity())
    .then(respond(res))
    .catch(handleError(res));
}

export function search(req, res) {
  var qs = req.query;
  var page = Number(req.query.page);
  var tags, by, text;

  if (qs.tags) {
    tags = qs.tags.split(',');
  }
  if (qs.by) {
    by = qs.by.split(',');
  }
  if (qs.text) {
    text = qs.text;
  }

  service.searchPosts({tags, by, text}, page)
    .then(respond(res))
    .catch(handleError(res));
}
