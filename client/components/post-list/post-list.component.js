class PostListController {
  posts = [];

  currentPage = 0;
  busy = false;
  loadedAll = false;
  noPosts = false;

  $onInit() {
    this.nextPage();
  }

  /**
   * Calls the `load` function to retrieve the next page
   * and append it to the posts array.
   * The `load` function should accept the current page as an argument
   * and return a promise.
   */
  nextPage() {
    if (this.loadedAll) {
      return;
    }

    this.busy = true;

    this.load(this.currentPage).then(res => {
      if (res.total == 0) {
        this.noPosts = true;
      }

      if (res.page == res.pages) {
        this.loadedAll = true;
      }

      this.posts = this.posts.concat(res.docs);
      this.currentPage = res.page;
    })
      .finally(() => this.busy = false);
  }

}

angular.module('whateverApp')
  .component('postList', {
    controller: PostListController,
    templateUrl: 'components/post-list/post-list.html',
    bindings: {load: '<'}
  });
