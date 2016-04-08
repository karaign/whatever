angular.module('whateverApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('user', {
        url: '/@:name',
        templateUrl: 'app/user/user.html',
        controller: 'UserController',
        controllerAs: 'vm',
        resolve: {me: Auth => Auth.resolveUser()}
      });
  });
