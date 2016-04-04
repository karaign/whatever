'use strict';

angular.module('whateverApp')
  .directive('notifications', function () {
    return {
      templateUrl: 'components/notifications/notifications.html',
      restrict: 'E',
      controller($scope, notifier) {
        $scope.alerts = notifier.list;
        $scope.dismiss = notifier.dismiss;
      }
    };
  });
