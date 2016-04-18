angular.module('whateverApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('search', {
        url: '/search?tags&by&text',
        templateUrl: 'app/search/search.html',
        controller: 'SearchController',
        controllerAs: 'vm'
      });
  });
