class NavbarController {
  menu = [{
    'title': 'Home',
    'state': 'main'
  }, {
    'title': 'Write',
    'state': 'write'
  }];

  isCollapsed = true;

  constructor(Auth) {
    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;
  }
}

angular.module('whateverApp')
  .controller('NavbarController', NavbarController);
