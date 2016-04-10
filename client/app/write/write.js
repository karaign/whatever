angular.module('whateverApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('write', {
        url: '/write',
        templateUrl: 'app/write/write.html',
        controller: 'WriteController',
        controllerAs: 'vm',
        resolve: {me: Auth => Auth.resolveUser()}
      });
  });
