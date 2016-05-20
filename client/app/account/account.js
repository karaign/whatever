angular.module('whateverApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('me', {
        url: '/me',
        template: '',
        controller: function($state, Auth) {
          Auth.getCurrentUser(me => {
            if (!me) {
              $state.go('login');
            } else {
              $state.go('user', {name: me.name}, {location: false});
            }
          });
        }
      })
      .state('login', {
        url: '/login',
        templateUrl: 'app/account/login/login.html',
        controller: 'LoginController',
        controllerAs: 'vm'
      })
      .state('logout', {
        url: '/logout?referrer',
        referrer: 'main',
        template: '',
        controller: function($state, Auth) {
          var referrer = $state.params.referrer ||
                          $state.current.referrer ||
                          'main';
          var params = {};

          if (referrer == $state.current.referrer) {
            params = $state.current.refParams;
          }

          Auth.logout();
          $state.go(referrer, params);
        }
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'app/account/signup/signup.html',
        controller: 'SignupController',
        controllerAs: 'vm'
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'app/account/settings/settings.html',
        controller: 'SettingsController',
        controllerAs: 'vm',
        authenticate: true
      });
  })
  .run(function($rootScope, $state) {
    $rootScope.$on('$stateChangeStart', function(event, next, nextParams, current) {
      if (next.name === 'logout' && current && current.name && !current.authenticate) {
        next.referrer = current.name;
        next.refParams = $state.params;
      }
    });
  });
