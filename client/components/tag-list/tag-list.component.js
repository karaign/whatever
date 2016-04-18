angular.module('whateverApp')
  .component('tagList', {
    bindings: {tags: '<'},
    template: `<a class="label label-default" ng-repeat="tag in $ctrl.tags" ui-sref="search({tags:tag})">{{tag}}</a>
    <span ng-if="$ctrl.tags.length == 0" class="text-muted">(none)</span>`
  });
