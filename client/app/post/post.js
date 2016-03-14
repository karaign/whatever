'use strict';

angular.module('whateverApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('post', {
        url: '/@:name/:slug',
        templateUrl: 'app/post/post.html',
        controller: 'PostCtrl',
        controllerAs: 'vm'
      });
  });
