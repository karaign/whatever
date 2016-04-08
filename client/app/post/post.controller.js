class PostController {
  editPermission = false;

  constructor($stateParams, $state, Post, Auth, Modal, me) {
    var name = $stateParams.name;
    var slug = $stateParams.slug;

    this.Modal = Modal;
    this.$state = $state;
    this.post = Post.byUserAndSlug({name, slug});
    this.post.$promise.then(post => {
      if (Auth.isAdmin() || me && me._id == post.author._id) {
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
        this.$state.go('main');
      });
    })('this post');
  }
}

angular.module('whateverApp')
  .controller('PostController', PostController);
