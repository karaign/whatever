'use strict';

angular.module('whateverApp')
  .directive('markdownEditor', function () {
    return {
      templateUrl: 'components/markdown-editor/markdown-editor.html',
      restrict: 'E',
      scope: {
        ngModel: '='
      },
      link: function (scope, element, attrs) {
        var mde = new SimpleMDE({
          element: element.find('textarea')[0],
          previewRender(text) {
            var converter = new Showdown.converter();
            return converter.makeHtml(text);
          }
        });
      }
    };
  });
