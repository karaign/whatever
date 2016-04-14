angular.module('whateverApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('tag', {
        url: '/tag/:tag',
        templateUrl: 'app/tag/tag.html',
        controller: 'TagController',
        controllerAs: 'vm'
      });
  });
