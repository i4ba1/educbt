'use strict';
angular
  .module('app.core')
  .controller('ChangePasswordController', function($scope, $stateParams, $timeout, $state, storageService, deferredService, errorHandle, changePswdService) {

    var token = "";
    var user = null;

    $scope.data = {
      'oldPass': '',
      'newPass': '',
      'confirmPass': ''
    };

    function checkAuthorization(userType) {
      if (!storageService.isAuthorization(userType)) {
        $state.go("login");
      } else {
        token = storageService.getToken();
        user = storageService.getLoggedInUser();
      }
    }

    function showMesage(status) {
      var message = "";
      if (status == 404) {
        message = "Kata sandi lama salah";
      } else if (status == 417) {
        message = "Konfirmasi kata sandi baru salah";
      } else if (status == 409) {
        message = "Kata sandi baru masih sama dengan kata sandi lama";
      } else if (status == 200) {
        message = "Kata sandi berhasil di ganti";
      }

      $timeout(function() {
        window.alert(message);
      }, 1000);
    }

    $scope.saveNewPass = function() {
      var promise = deferredService.getPromise(changePswdService.updatePassword($scope.data, token, user.userName));
      promise.then(
        function(response) {
          showMesage(200);
          $state.go("^");
        },
        function(errorResponse) {
          if (errorResponse.status == 401) {
            errorHandle.setError(errorResponse);
          } else {
            showMesage(errorResponse.status);
          }
        }
      );

    }

    if ($state.is('admin.changePswd')) {
      checkAuthorization("ADMIN");
    } else if ($state.is('teacher.changePswd')) {
      checkAuthorization("EMPLOYEE")
    } else if ($state.is('student.changePswd')) {
      checkAuthorization("STUDENT")
    }

  });
