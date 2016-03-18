'use strict';

class WriteCtrl {
  constructor(Auth, $state) {
    Auth.getCurrentUser(me => {
      if (!me) {
        $state.go('login');
      }
      this.me = me;
    });
  }
  slugify(str) {
    return slug(str, {lower: true});
  }
}

angular.module('whateverApp')
  .controller('WriteCtrl', WriteCtrl);

