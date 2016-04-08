angular.module('whateverApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('post', {
        url: '/@:name/:slug',
        templateUrl: 'app/post/post.html',
        controller: 'PostController',
        controllerAs: 'vm',
        resolve: {me: Auth => Auth.resolveUser()}
      });
  });
