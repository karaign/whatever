class TagController {
  nextPage = currentPage => this.Post.byTag({
    tag: this.tag,
    page: currentPage + 1
  }).$promise;

  constructor($stateParams, Post) {
    this.tag = $stateParams.tag;
    this.Post = Post;
  }
}

angular.module('whateverApp')
  .controller('TagController', TagController);
