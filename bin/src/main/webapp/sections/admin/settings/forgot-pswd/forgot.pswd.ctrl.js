angular.module('app.core')
  .controller('ForgotPasswordController', function($state, $scope,
    storageService, forgotPassService, deferredService, DialogFactory) {
    $scope.identity = "";
    $scope.result = "";
    $scope.showResult = false;
    /*
     * checking authorization
     */
    if (!storageService.isAuthorization("ADMIN")) {
      $state.go("login");
    } else {
      token = storageService.getToken();
    }

    $scope.getPasswordByNisOrNip = function() {
      var promise = deferredService.getPromise(forgotPassService.findByNisOrNip(
        token, $scope.identity));
      promise.then(function(response) {
          $scope.result = response.data;
          $scope.showResult = true;
        },
        function(errorResponse) {
          if (errorResponse.status == 404) {
            DialogFactory.showDialogMsg("data tidak valid","maaf nis/nip tidak ditemukan","sm")
          }
        });
    };

    $scope.checkInput = function() {
      if ($scope.identity == null) {
        $scope.showResult = false;
      }
    }

  });
