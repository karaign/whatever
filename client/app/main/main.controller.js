class MainController {
  nextPage = currentPage => this.Post.get({page: currentPage + 1}).$promise;

  constructor(Post, me) {
    this.Post = Post;
  }
}

angular.module('whateverApp')
  .controller('MainController', MainController);

