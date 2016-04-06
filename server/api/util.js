import {merge} from 'lodash';
import HTTPError from 'node-http-error';

/**
 * Returns a function that sends the response.
 *
 * @param {express.response} res
 * @param {number} [statusCode]
 * @returns {Function}
 */
export function respond(res, statusCode = 200) {
  return function(entity) {
    res.status(statusCode);
    entity ?
      res.json(entity) :
      res.end();
  };
}

/**
 * Returns a function that saves the updates to the DB.
 *
 * @param {Object} updates
 * @returns {Function}
 */
export function saveUpdates(updates) {
  return function(entity) {
    var updated = merge(entity, updates);
    return updated.save()
      .spread(updated => {
        return updated;
      });
  };
}

/**
 * Returns a function that removes the entity from the DB.
 *
 * @returns {Function}
 */
export function removeEntity() {
  return function(entity) {
    if (entity) {
      return entity.remove();
    }
  };
}

/**
 * Returns an error handler which sends an error response.
 * If the error is an HTTPError, its code is used
 * instead of the one passed as an argument.
 *
 * @param {express.response} res
 * @param {number} [statusCode=500]
 * @returns {Function}
 */
export function handleError(res, statusCode = 500) {
  return function(err) {
    res.status(err.status || statusCode).send(err);
  };
}

/**
 * Returns a function which throws an HTTPError if an entity isn't there.
 *
 * @param {number} [statusCode=404]
 * @returns {Function}
 */
export function checkEntity(statusCode = 404) {
  return function(entity) {
    if (!entity) {
      throw new HTTPError(statusCode);
    }
    return entity;
  };
}

