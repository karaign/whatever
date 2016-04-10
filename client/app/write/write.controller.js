/* globals slug */
class WriteController {
  title = 'Your title here';
  tags = [];

  constructor($state, Post, me) {
    if (!me) $state.go('login');
    this.me = me;
    this.Post = Post;
    this.state = $state;
  }
  slugifyTitle() {
    return slug(this.title, {lower: true});
  }
  submit() {
    this.Post.save({
      body: this.body,
      title: this.title,
      slug: this.slug || this.slugifyTitle(),
      tags: this.tags.map(t => t.text)
    }, res => {
      this.state.go('post', {name: this.me.name, slug: res.slug});
    });
  }
}

angular.module('whateverApp')
  .controller('WriteController', WriteController);

