'use strict';

function notifier() {
  var notifications = [];
  
  function add(type) {
    return function(message) {
      notifications.push({type, message});
    }
  }
  
  return {
    success: add('success'),
    info: add('info'),
    warning: add('warning'),
    danger: add('danger'),
    get() {
      return notifications;
    },
    dismiss(alert) {
      _.remove(notifications, alert);
    }
  };
}

angular.module('whateverApp')
  .factory('notifier', notifier);