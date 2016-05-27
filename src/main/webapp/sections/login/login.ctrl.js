'use strict';
angular
  .module('app.core')
  .controller('LoginController', function($scope, $stateParams, $state, $timeout, loginService, deferredService, localStorageService) {
    $scope.showDialog = false;
    if (localStorageService.isSupported) {
      console.log("Length : " + localStorageService.length());
      if (localStorageService.length() == 0) {
        //$scope.showDialog = true;
        var promise = deferredService.getPromise(loginService.createAdmin());
        promise.then(function(response) {
          //$scope.showDialog = false;
          localStorageService.set('isAdminCreated', true);
        }, function(data) {
          //$scope.showDialog = false;
          localStorageService.set('isAdminCreated', false);
        });
      }
    }

    $scope.user = {};
    $scope.loginSubmit = function() {
      if ($scope.user != null) {
        var promise = deferredService.getPromise(loginService.loggingIn($scope.user));
        promise.then(
            function(response) {
              localStorageService.set('TOKEN', response.data[0].token);
              localStorageService.set('USER', response.data[0].user);
            },
            function(errorResponse) {
              var message = "";
              if (errorResponse.status == 404) {
                message = "Nama Pengguna atau Kata Sandi Tidak Valid";
              } else if (errorResponse.status == 403) {
                message = "Maaf Kuota Sudah Penuh";
              } else {
                message = "lost connection with server"
              }

              $timeout(function() {
                window.alert(message);
              }, 1500);

            })
          .then(function() {
            $scope.user = localStorageService.get('USER');
            if ($scope.user != null) {
              var type = $scope.user.userType;
              if (type.toLowerCase() === "admin") {
                $state.go('admin');
              } else if (type.toLowerCase() === "employee") {
                $state.go('teacher');
              } else if (type.toLowerCase() === "student") {
                $state.go('student');
              }
            }
          });
      }
    };
  });
