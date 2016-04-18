angular.module('whateverApp')
  .component('postPreview', {
    templateUrl: 'components/post-preview/post-preview.html',
    bindings: {post: '<', showAuthor: '<'}
  });
