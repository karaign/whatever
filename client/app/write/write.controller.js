'use strict';

class WriteCtrl {
  /* nonstandard */
  title = 'Your title here';
  /* /nonstandard */
  constructor(Auth, $state, Post) {
    Auth.isLoggedIn(loggedIn => {
      if (!loggedIn) $state.go('login');
    });
    Auth.getCurrentUser(me => this.me = me);
    this.Post = Post;
    this.state = $state;
  }
  slugifyTitle() {
    /* globals slug */
    return slug(this.title, {lower: true});
  }
  submit() {
    this.Post.save({
      body: this.editor.value(),
      title: this.title,
      slug: this.slug || this.slugifyTitle(),
      tags: this.tags
    }, res => {
      this.state.go('post', {name: this.me.name, slug: res.slug});
    });
  }
}

angular.module('whateverApp')
  .controller('WriteCtrl', WriteCtrl);
