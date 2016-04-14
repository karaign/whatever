function PostResource($resource) {
  return $resource('/api/posts/:id', {id: '@_id'}, {
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
    }
  });
}

angular.module('whateverApp')
  .factory('Post', PostResource);
