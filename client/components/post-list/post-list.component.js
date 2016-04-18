class PostListController {
  posts = [];

  currentPage = 0;
  busy = false;
  loadedAll = false;
  noPosts = false;

  $onInit() {
    this.nextPage();
  }

  $onChanges(changes) {
    if (changes.loadNextPage)  {
      this.constructor(); // Reset all properties to defaults
      this.nextPage();
    }
  }

  /**
   * Loads the next page and appends it to the posts array.
   **/
  nextPage() {
    if (this.loadedAll || !this.loadNextPage) {
      return;
    }

    this.busy = true;

    this.loadNextPage(this.currentPage).then(res => {
      if (res.total == 0) {
        this.noPosts = true;
      }

      if (res.page == res.pages) {
        this.loadedAll = true;
      }

      this.posts = this.posts.concat(res.docs);
      this.currentPage = res.page;

      this.onLoad({res});
    })
      .finally(() => this.busy = false);
  }

}

angular.module('whateverApp')
  .component('postList', {
    controller: PostListController,
    templateUrl: 'components/post-list/post-list.html',
    bindings: {loadNextPage: '<nextPage', onLoad: '&', hideAuthor: '<'}
  });
