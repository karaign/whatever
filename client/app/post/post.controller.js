'use strict';

function PostCtrl($stateParams, Post, notifier) {
  var name = $stateParams.name,
      slug = $stateParams.slug;
      
  this.post = Post.byUserAndSlug({name, slug});
}

angular.module('whateverApp')
  .controller('PostCtrl', PostCtrl);
