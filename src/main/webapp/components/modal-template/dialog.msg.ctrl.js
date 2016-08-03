'use strict';
angular
  .module('app.messages')
  .controller('DialogMessageCtrl', function($scope, $uibModalInstance, titleText, contentText) {

    $scope.titleText = titleText;
    $scope.contentText = contentText;

    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };
  });