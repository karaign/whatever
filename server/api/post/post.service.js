import Post from './post.model';
import User from '../user/user.model';

import {merge} from 'lodash';

/**
 * Finds a post by id.
 * @param {string} id
 * @returns {Promise}
 */
export function getPost(id) {
  return Post.findById(id).exec();
}

/**
 * Creates a new post.
 * @param {string} id
 * @returns {Promise}
 */
export function createPost(data) {
  data.date = Date.now();
  return Post.create(data);
}

/**
 * Finds a post by id and modifies it.
 * If no post is found, the promise resolves to null.
 * @param {string} id
 * @param {object} data
 * @param {function} [checkPermission]
 * @returns {Promise}
 */
export function editPost(id, data) {
  return Post.findById(id).exec().then(post => {
    if (post) {
      merge(post, data);
      return post.save();
    } else {
      return null;
    }
  });
}

/**
 * Finds a post by id and removes it.
 * @param {string} id
 * @returns {Promise}
 */
export function deletePost(id) {
  return Post.findByIdAndRemove(id).exec();
}

/**
 * Constructs a user's personal feed.
 * @param {object} user
 * @param {number} page
 * @returns {Promise}
 */
export function getFeed(user, page) {
  return Post.paginate({
    author: {$in: user.following}
  }, {page});
}

/**
 * Finds posts by a specific user.
 * @param {string} name
 * @param {number} page
 * @returns {Promise}
 */
export function getPostsByUserName(name, page) {
  return User.findOne({name}).exec()
    .then(author => author && Post.paginate({author}, {name}));
}

/**
 * Finds a post by author and slug.
 * @param {string} name
 * @param {string} slug
 * @returns {Promise}
 */
export function getPostByUserNameAndSlug(name, slug) {
  return User.findOne({name}).exec()
    .then(author => author && Post.findOne({author, slug})
          .populate('author')
          .exec());
}

/**
 * Finds posts author, tags and/or text content.
 * @param {object} query
 * @param {string[]} [query.by]
 * @param {string[]} [query.tags]
 * @param {string}   [query.text]
 * @param {number} page
 * @returns {Promise}
 */
export function searchPosts({tags, by, text}, page) {

  function query(users = []) {
    var q = {};
    if (tags) q.tags = {$in: tags};
    if (text) q.$text = {$search: text};
    if (users.length) q.author = {$in: users};
    return Post.paginate(q, {page});
  }

  return by ?
    User.find({
      name: {$in: by}
    }).then(query)
    : query();
}
