function PostResource($resource) {
  var Post = $resource('/api/posts/:id/:controller', {
    id: '@_id'
  }, {
    update: {
      method: 'PUT'
    },
    byUser: {
      method: 'GET',
      url: '/api/posts/by/:name/'
    },
    byUserAndSlug: {
      method: 'GET',
      url: '/api/posts/by/:name/:slug'
    },
    recent: {
      method: 'GET',
      url: '/api/posts/recent'
    },
    byTag: {
      method: 'GET',
      url: '/api/posts/tag/:tag'
    },
    search: {
      method: 'GET',
      url: '/api/posts/search'
    },
    like: {
      method: 'PUT',
      params: {controller: 'like'}
    },
    unlike: {
      method: 'PUT',
      params: {controller: 'unlike'}
    },
    getResponses: {
      method: 'GET',
      params: {controller: 'responses'}
    }
  });

  angular.extend(Post.prototype, {
    $getResponses({page}, callback, onError) {
      return Post.getResponses({id: this._id, page}, callback, onError);
    }
  });

  return Post;
}

angular.module('whateverApp')
  .factory('Post', PostResource);
