angular.module('whateverApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('search', {
        url: '/search',
        templateUrl: 'app/search/search.html',
        controller: 'SearchController',
        controllerAs: 'vm'
      });
  });
