/* global SimpleMDE */

angular.module('whateverApp')
  .directive('markdownEditor', function() {
    return {
      templateUrl: 'components/markdown-editor/markdown-editor.html',
      restrict: 'E',
      replace: true,
      scope: {config: '<', onChange: '&'},

      link(scope, element, attrs) {
        const defaults = {
          initialValue: scope.model,
          promptURLs: true,
          forceSync: true,
          element: element.find('textarea')[0],
          spellChecker: false,
          toolbar: ['bold', 'italic', 'strikethrough',
           '|', 'heading-1', 'heading-2', 'heading-3',
           '|', 'quote', 'code',
           '|', 'unordered-list', 'ordered-list',
           '|', 'link', 'image', 'table',
           '|', 'preview', 'guide']
        };

        var mde = new SimpleMDE(
          angular.extend(defaults, scope.config || {})
        );

        scope.mde = mde;
        mde.codemirror.on('change', () => scope.onChange({value: mde.value()}));
      }
    };
  });
