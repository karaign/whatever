class MainController {
  currentPage = 0;
  posts = [];
  busy = false;
  loadedAll = false;

  constructor(Post, Auth, $state) {
    this.Post = Post;
    this.nextPage();

    Auth.getCurrentUser(me => {
      this.me = me;
      if (me.following.length === 0) {
        $state.go('recent', {});
      }
    });
  }
  /**
   * Loads a new page of posts from the server and appends
   * them to the posts array.
   */
  nextPage() {
    if (this.loadedAll) {
      return;
    }
    this.busy = true;
    this.Post.get({
      page: this.currentPage + 1
    }, res => {
      this.busy = false;
      if (res.page == res.pages) {
        this.loadedAll = true;
      }
      this.posts = this.posts.concat(res.docs);
      this.currentPage = res.page;
    });
  }
}

angular.module('whateverApp')
  .controller('MainController', MainController);

