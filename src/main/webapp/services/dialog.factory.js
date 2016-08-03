angular.module('app.messages')
    .factory('DialogFactory', ['$uibModal', function ($uibModal) {
        return {
            showDialogMsg: function (title, content, size) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'components/modal-template/dialog.msg.html',
                    controller: 'DialogMessageCtrl',
                    size: size,
                    resolve: {
                        titleText: function () {
                            return title;
                        },
                        contentText: function () {
                            return content;
                        }
                    }
                });
            }

        };
    }]);
