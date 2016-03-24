'use strict';

angular.module('whateverApp', [
  'whateverApp.auth',
  'whateverApp.admin',
  'whateverApp.constants',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'validation.match',
  'infinite-scroll',
  'hc.marked',
  'angularMoment',
  'angular-bind-html-compile',
  'ngPatternRestrict',
  'ngTagsInput'
])
  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  });
