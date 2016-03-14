'use strict';

angular.module('whateverApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('user', {
        url: '/@:name?page',
        templateUrl: 'app/user/user.html',
        controller: 'UserCtrl',
        controllerAs: 'vm',
        authenticate: false
      });
  });
