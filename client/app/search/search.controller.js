class SearchController {
  nextPage = page => this.Post.search({
    page: page + 1,
    tags: this.params.tags,
    text: this.params.text,
    by:   this.params.by
  }).$promise;

  total = 0;

  constructor(Post, $stateParams, $state) {
    this.Post = Post;
    this.params = $stateParams;
    this.state = $state;

    this.text = $stateParams.text;
    this.tags = stringToArray($stateParams.tags);
    this.by = stringToArray($stateParams.by);
  }

  search() {
    this.state.go('search', {
      text: this.text,
      tags: arrayToString(this.tags),
      by: arrayToString(this.by)
    });
  }
}

function arrayToString(arr) {
  return arr ? arr.map(i => i.text).join(',') : undefined;
}

function stringToArray(str) {
  return str ? str.split(',').map(text => ({text})) : [];
}

angular.module('whateverApp')
  .controller('SearchController', SearchController);
