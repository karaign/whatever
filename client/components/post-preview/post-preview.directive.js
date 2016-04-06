angular.module('whateverApp')
  .directive('postPreview', function() {
    return {
      templateUrl: 'components/post-preview/post-preview.html',
      restrict: 'E',
      scope: {post: '=', author: '='}
    };
  });
