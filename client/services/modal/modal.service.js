angular.module('whateverApp')
  .factory('Modal', function($rootScope, $uibModal) {
    /**
     * Opens a modal
     * @param  {Object} scope      - an object to be merged with modal's scope
     * @param  {String} modalClass - (optional) class(es) to be applied to the modal
     * @param  {String} size
     * @return {Object}            - the instance $modal.open() returns
     */
    function openModal(scope = {}, modalClass = 'modal-default', size) {
      var modalScope = $rootScope.$new();

      angular.extend(modalScope, scope);

      return $uibModal.open({
        size: size,
        templateUrl: 'services/modal/modal.html',
        windowClass: modalClass,
        scope: modalScope
      });
    }

    // Public API here
    return {

      /**
       * Create a function to open a pop-up markdown editor
       * @param {Function} callback
       * @return {Function}
       */
      editor(callback = angular.noop) {
        /**
         * Open a markdown editor
         * @param {string} title
         * @param {string} initialValue
         * @param {Function} callback
         */
        return function(title, initialValue = '') {
          var editor = openModal({
            modal: {
              dismissable: false,
              title: `Edit ${title}`,
              value: initialValue,
              html: `<markdown-editor
               config="{initialValue: modal.value}" on-change="modal.value = value"></markdown-editor>`,
              buttons: [{
                classes: 'btn btn-primary',
                text: 'Confirm',
                click: (e, scope) => editor.close(scope.value)
              }, {
                classes: 'btn btn-default',
                text: 'Cancel',
                click: e => editor.dismiss(e)
              }]
            }
          }, 'modal-default', 'lg');

          editor.result.then(text => {
            callback(text);
          });
        };
      },

      /**
       * Create a function to show a list of users
       * @return {Function}
       */
      userList() {
        /**
         * Show a list of users
         * @param {Array} users
         * @param {String} title - the title of the modal window
         */
        return function(title, users) {
          var userList = openModal({
            modal: {
              dismissable: true,
              title, users,
              html:
               `<div class="alert alert-info" ng-if="modal.users.length === 0">
                  This list is empty.
                </div>
                <div class="list-group">
                  <a ng-repeat="user in modal.users" ng-click="$close()"
                  ui-sref="user({name: user.name})" class="list-group-item">
                     {{user.displayName}} <small>@{{user.name}}</small>
                  </a>
                </div>`,
              buttons: [{
                classes: 'btn-default',
                text: 'Close',
                click: e => userList.close(e)
              }]
            }
          });
        };
      },

      /* Confirmation modals */
      confirm: {

        /**
         * Create a function to open a delete confirmation modal (ex. ng-click='myModalFn(name, arg1, arg2...)')
         * @param  {Function} del - callback, ran when delete is confirmed
         * @return {Function}     - the function to open the modal (ex. myModalFn)
         */
        delete(del = angular.noop) {
          /**
           * Open a delete confirmation modal
           * @param  {String} name   - name or info to show on modal
           * @param  {All}           - any additional args are passed straight to del callback
           */
          return function(name, ...args) {
            var deleteModal;

            deleteModal = openModal({
              modal: {
                dismissable: true,
                title: 'Confirm Delete',
                html: '<p>Are you sure you want to delete <strong>' + name + '</strong> ?</p>',
                buttons: [{
                  classes: 'btn-danger',
                  text: 'Delete',
                  click: function(e) {
                    deleteModal.close(e);
                  }
                }, {
                  classes: 'btn-default',
                  text: 'Cancel',
                  click: function(e) {
                    deleteModal.dismiss(e);
                  }
                }]
              }
            }, 'modal-danger');

            deleteModal.result.then(function(event) {
              del.apply(event, args);
            });
          };
        }
      }
    };
  });
