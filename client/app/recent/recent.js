angular.module('whateverApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('recent', {
        url: '/recent',
        templateUrl: '/app/recent/recent.html',
        controllerAs: 'vm',
        controller: function(Post) {
          this.posts = Post.recent();
        }
      });
  });
