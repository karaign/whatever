angular.module('whateverApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('user', {
        url: '/@:name?page',
        templateUrl: 'app/user/user.html',
        controller: 'UserController',
        controllerAs: 'vm',
        authenticate: false
      });
  });
