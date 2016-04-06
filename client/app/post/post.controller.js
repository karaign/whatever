class PostController {
  editPermission = false;

  constructor($stateParams, $state, Post, Auth, Modal, notifier) {
    var name = $stateParams.name;
    var slug = $stateParams.slug;

    this.notifier = notifier;
    this.Modal = Modal;
    this.$state = $state;
    this.post = Post.byUserAndSlug({name, slug});
    this.post.$promise
      .then(() => Auth.getCurrentUser(null))
      .then(me => {
        if (Auth.hasRole('admin') || me._id == this.post.author._id) {
          this.editPermission = true;
        }
      });
  }
  /**
   * Deletes the post
   */
  delete() {
    this.Modal.confirm.delete(() => {
      this.post.$delete(() => {
        this.notifier.success('Post deleted successfully!');
        this.$state.go('main');
      });
    })('this post');
  }
}

angular.module('whateverApp')
  .controller('PostController', PostController);
