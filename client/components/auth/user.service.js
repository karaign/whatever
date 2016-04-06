function UserResource($resource) {
  var User = $resource('/api/users/:id/:controller', {
    id: '@_id'
  }, {
    changePassword: {
      method: 'PUT',
      params: {
        controller: 'password'
      }
    },
    get: {
      method: 'GET',
      params: {
        id: 'me'
      }
    },
    byName: {
      method: 'GET',
      url: '/api/users/name/:name'
    },
    getFollowers: {
      method: 'GET',
      params: {controller: 'followers'},
      isArray: true
    },
    getFollowing: {
      method: 'GET',
      params: {controller: 'following'},
      isArray: true
    },
    follow: {
      method: 'PUT',
      params: {controller: 'follow'}
    },
    unfollow: {
      method: 'PUT',
      params: {controller: 'unfollow'}
    }
  });

  function arrayGetter(propertyName) {
    return function(callback, onError) {
      if (this[propertyName]) {
        callback(this[propertyName]);
      } else {
        this.constructor['get' + _.capitalize(propertyName)](
        {id: this._id},
        res => {
          this[propertyName] = res;
          callback(res);
        }, onError);
      }
    };
  }

  angular.extend(User.prototype, {
    $getFollowers: arrayGetter('followers'),
    $getFollowing: arrayGetter('following')
  });

  return User;
}

angular.module('whateverApp.auth')
  .factory('User', UserResource);
