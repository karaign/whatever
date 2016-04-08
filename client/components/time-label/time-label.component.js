angular.module('whateverApp')
  .component('timeLabel', {
    bindings: {date: '<'},
    template: `<span am-time-ago="$ctrl.date"
     uib-tooltip="{{$ctrl.date | amDateFormat: 'MMMM Do, HH:mm'}}"></span>`
  });
