(function() {

    'use strict';
    angular.module('app').controller('ForgotPasswordController', ForgotPasswordController);

    ForgotPasswordController.$inject = ['$state', '$scope', 'storageService', 'forgotPassService', 'DialogFactory'];

    function ForgotPasswordController($state, $scope, storageService, forgotPassService, DialogFactory) {
        $scope.identity = "";
        $scope.result = "";
        $scope.showResult = false;
        var token;
        /*
         * checking authorization
         */
        if (!storageService.isAuthorization("ADMIN")) {
            $state.go("checkroute");
        } else {
            token = storageService.getToken();
        }

        $scope.getPasswordByNisOrNip = function() {
            var promise = forgotPassService.findByNisOrNip(token, $scope.identity);
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