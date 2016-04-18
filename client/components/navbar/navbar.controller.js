class NavbarController {
  menu = [{
    title: 'Home',
    state: 'main',
    icon: 'home'
  }, {
    title: 'Write',
    state: 'write',
    icon: 'pencil'
  }, {
    title: 'Search',
    state: 'search',
    icon: 'search'
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
