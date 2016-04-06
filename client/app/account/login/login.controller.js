class LoginController {
  constructor(Auth, $state, Post) {
    this.user = {};
    this.errors = {};
    this.submitted = false;

    this.Auth = Auth;
    this.$state = $state;
    
    this.recentPosts = Post.recent();
  }

  login(form) {
    this.submitted = true;

    if (form.$valid) {
      this.Auth.login({
        email: this.user.email,
        password: this.user.password
      })
      .then(() => {
        // Logged in, redirect to home
        this.$state.go('main');
      })
      .catch(err => {
        this.errors.other = err.message;
      });
    }
  }
}

angular.module('whateverApp')
  .controller('LoginController', LoginController);
