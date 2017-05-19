(function() {

    'use strict';

    angular
        .module('app')
        .controller('ForgotPasswordController', ForgotPasswordController);

    ForgotPasswordController.$inject = ['$state', '$scope', 'storageService', 'ForgotPassService', 'DialogFactory'];

    function ForgotPasswordController($state, $scope, storageService, ForgotPassService, DialogFactory) {
        $scope.identity = "";
        $scope.result = "";
        $scope.showResult = false;
        /*
         * checking authorization
         */
        if (!storageService.isAuthorization("ADMIN")) {
            $state.go("checkroute");
        } else {
            token = storageService.getToken();
        }

        $scope.getPasswordByNisOrNip = function() {
            var promise = ForgotPassService.findByNisOrNip(token, $scope.identity);
            promise.then(function(response) {
                    $scope.result = response.data;
                    $scope.showResult = true;
                },
                function(errorResponse) {
                    if (errorResponse.status == 404) {
                        DialogFactory.showDialogMsg("data tidak valid", "maaf nis/nip tidak ditemukan", "sm")
                    }
                });
        };

        $scope.checkInput = function() {
            if ($scope.identity == null) {
                $scope.showResult = false;
            }
        }

    }

})();