class SearchController {
  text = '';
  caseSensitive = false;

  constructor(Post) {
    this.Post = Post;
    this.search();
  }

  search() {
    this.nextPage = currentPage => {
      return this.Post.search({
        page: currentPage + 1,
        text: this.text,
        caseSensitive: this.caseSensitive || undefined
      }).$promise;
    };
  }
}

angular.module('whateverApp')
  .controller('SearchController', SearchController);
