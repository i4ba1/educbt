'use strict';
angular
  .module('app.core')
  .controller('ModalInstanceCtrl', function($scope, $uibModalInstance, modalData) {

    $scope.modalData = modalData;

    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };
  });
