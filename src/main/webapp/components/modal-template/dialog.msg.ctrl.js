'use strict';
angular
    .module('app')
    .controller('DialogMessageCtrl', function($scope, $uibModalInstance, titleText, contentText, $sce) {

        $scope.titleText = titleText;
        $scope.contentText = contentText;
        $scope.trustAsHtml = $sce.trustAsHtml;

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.close = function(value) {
            $uibModalInstance.close(value);
        }
    });