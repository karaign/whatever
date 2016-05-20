angular.module('whateverApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'vm',
        // authenticate: true,
        resolve: {'me': Auth => Auth.resolveUser()}
      });
  });
