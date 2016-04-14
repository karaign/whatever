class UserController {
  isSelf = false;
  isFollowed = false;
  isLoggedIn = true;
  nextPage = currentPage => this.Post.byUser({
    name: this.userName,
    page: currentPage + 1
  }).$promise;

  constructor($stateParams, Post, User, Modal, me) {
    this.Post = Post;
    this.userName = $stateParams.name;
    this.openModal = Modal.userList();

    this.user = User.byName({name: this.userName});

    if (!me) {
      this.isLoggedIn = false;
      return;
    }

    this.user.$promise.then(user => {
      if (me._id == user._id) {
        this.isSelf = true;
      } else if (me.following.indexOf(user._id) > -1) {
        this.isFollowed = true;
      }
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
