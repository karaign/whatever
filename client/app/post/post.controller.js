class PostController {
  editPermission = false;
  isLiked = false;

  nextPage = page => this.post
    .$promise
    .then(() => this.post.$getResponses({
      page: page + 1
    }).$promise);

  constructor($stateParams, $state, Post, Auth, Modal, me) {
    this.Auth = Auth;

    this.post = Post.byUserAndSlug({
      name: $stateParams.name,
      slug: $stateParams.slug
    });

    this.confirmDelete = Modal.confirm.delete(() =>
      this.post.$delete(() => $state.go('main'))
    );

    this.post.$promise.then(post => {
      if (this.Auth.isAdmin() || me && me._id == post.author._id) {
        this.editPermission = true;
      }

      this.isLiked = post.likedBy.indexOf(me._id) > -1;
      this.responseTo = post.responseTo;
    });
  }

  delete() {
    this.confirmDelete(this.post.title);
  }

  like() {
    this.post.$like(res => {
      this.isLiked = true;
    });
  }

  unlike() {
    this.post.$unlike(res => {
      this.isLiked = false;
    });
  }
}

angular.module('whateverApp')
  .controller('PostController', PostController);
