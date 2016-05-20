/* globals slug */
class WriteController {
  title = 'Your title here';
  tags = [];

  constructor($state, $stateParams, Post, me) {
    this.me = me;
    this.Post = Post;
    this.state = $state;
    this.responseTo = $stateParams.responseTo;
    if (this.responseTo) {
      this.title = 'Re: ' + this.responseTo.title;
    }
  }

  slugifyTitle() {
    return slug(this.title, {lower: true});
  }

  submit() {
    this.Post.save({
      body: this.body,
      title: this.title,
      slug: this.slug || this.slugifyTitle(),
      tags: this.tags.map(t => t.text),
      responseTo: this.responseTo && this.responseTo._id
    }, res => {
      this.state.go('post', {name: this.me.name, slug: res.slug});
    });
  }
}

angular.module('whateverApp')
  .controller('WriteController', WriteController);

