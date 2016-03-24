'use strict';

class NavbarController {
  /* nonstandard */
  menu = [{
    'title': 'Home',
    'state': 'main'
  }, {
    'title': 'Write',
    'state': 'write'
  }];

  isCollapsed = true;
  /* /nonstandard */

  constructor(Auth) {
    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;
  }
}

angular.module('whateverApp')
  .controller('NavbarController', NavbarController);
