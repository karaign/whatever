'use strict';

angular.module('whateverApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('write', {
        url: '/write',
        templateUrl: 'app/write/write.html',
        controller: 'WriteCtrl',
        controllerAs: 'vm'
      });
  });
