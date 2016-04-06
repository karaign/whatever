class UserController {
  isSelf = false;
  isFollowed = false;
  isLoggedIn = true;

  constructor($stateParams, $window, appConfig, Post, User, Modal, Auth) {
    this.userName = $stateParams.name;
    this.currentPage = $stateParams.page || 1;
    this.perPage = appConfig.postsPerPage;

    this.openModal = Modal.userList();
    this.Post = Post;
    this.window = $window;

    this.user = User.byName({name: this.userName});

    this.user.$promise
      .then(() => Auth.isLoggedIn(null))
      .then(loggedIn => this.isLoggedIn = loggedIn)
      .then(() => Auth.getCurrentUser(null))
      .then(me => {
        if (!me) return;
        if (me._id === this.user._id) {
          this.isSelf = true;
        }
        if (me.following.indexOf(this.user._id) > -1) {
          this.isFollowed = true;
        }
      });

    this.loadPosts();
  }
  /**
   * Loads the current page of posts.
   */
  loadPosts() {
    this.Post.byUser({
      name: this.userName,
      page: this.currentPage
    }, res => {
      this.posts = res.docs;
      this.totalPosts = res.total;
      this.window.scrollTo(0, 0);
    });
  }
  /**
   * Shows a list of the user's followers.
   */
  showFollowers() {
    this.user.$getFollowers(users => {
      this.openModal(`@${this.user.name}'s followers`, users);
    });
  }
  /**
   * Shows a list of people the user follows.
   */
  showFollowing() {
    this.user.$getFollowing(users => {
      this.openModal(`People followed by @${this.user.name}`, users);
    });
  }
  /**
   * Follow the user.
   */
  follow() {
    this.user.$follow(() => this.isFollowed = true);
  }
  /**
   * Stop following the user.
   */
  unfollow() {
    this.user.$unfollow(() => this.isFollowed = false);
  }
}

angular.module('whateverApp')
  .controller('UserController', UserController);
