'use strict';

angular.module('whateverApp.auth', [
  'whateverApp.constants',
  'whateverApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
