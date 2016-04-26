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
  .config(function($urlRouterProvider, $locationProvider, markedProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);

    markedProvider.setOptions({
      sanitize: true
    });

    markedProvider.setRenderer({
      image(href, title, text) {
        return `<img class="img-responsive" src="${href}" alt="${text}" title="${title || text}">`;
      }
    });
  });
