class MainController {
  constructor(Post, me) {
    this.Post = Post;
  }

  /**
   * @param {Number} currentPage
   * @returns {Promise}
   */
  nextPage(currentPage) {
    return this.Post.get({
      page: currentPage + 1
    }).$promise;
  }
}

angular.module('whateverApp')
  .controller('MainController', MainController);

