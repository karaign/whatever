'use strict';

function PostCtrl($stateParams, Post) {
  var name = $stateParams.name,
      slug = $stateParams.slug;
      
  this.post = Post.byUserAndSlug({name, slug});
}

angular.module('whateverApp')
  .controller('PostCtrl', PostCtrl);
