(function() {

    'use strict';
    angular.module('app').controller('ModalInstanceCtrl', ModalInstanceCtrl);

    ModalInstanceCtrl.$inject = ['$scope', '$uibModalInstance', 'modalData'];

    function ModalInstanceCtrl($scope, $uibModalInstance, modalData) {

        $scope.modalData = modalData;

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
            var elements = document.getElementsByClassName('modal-backdrop');
            while (elements.length > 0) {
                elements[0].parentNode.removeChild(elements[0]);
            }
        };
    }

})();