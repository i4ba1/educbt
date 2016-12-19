'use strict';
angular
    .module('app.core')
    .controller('LoginController', function($scope, $stateParams, $state, $timeout, loginService, localStorageService, $rootScope, DialogFactory) {
        $scope.showDialog = false;
        $scope.openCredit = DialogFactory.openCredit;

        if (localStorageService.isSupported) {
            console.log("Length : " + localStorageService.length());
            if (localStorageService.length() == 0) {
                //$scope.showDialog = true;
                var promise = loginService.createAdmin();
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
                var promise = loginService.loggingIn($scope.user);
                promise.then(
                        function(response) {
                            localStorageService.set('TOKEN', response.data[0].token);
                            localStorageService.set('USER', response.data[0].user);
                            if (response.data[0].type !== null || response.data[0].type !== "" || response.data[0].type !== undefined) {
                                if (response.data[0].type === 'demo') {
                                    $rootScope.type = 'demo';
                                    localStorageService.set('APP-TYPE', 'demo');

                                } else {
                                    $rootScope.type = 'full-version';
                                    localStorageService.set('APP-TYPE', 'full-version');
                                }
                            }
                        },
                        function(errorResponse) {
                            var message = "";
                            var title = "";
                            if (errorResponse.status == 404) {
                                title = "Gagal Masuk";
                                message = "Nama Pengguna atau Kata Sandi Tidak Valid";
                            } else if (errorResponse.status == 403) {
                                title = "Kuota Penuh";
                                message = "Maaf jumlah siswa yang dibolehkan login sudah penuh";
                            } else {
                                title = "Applikasi Bermasalah";
                                message = "Maaf applikasi bermasalah silahkan hubungi PT KNT untuk perbaikan."
                            }

                            // $timeout(function () {
                            //   window.alert(message);
                            // }, 1500);

                            DialogFactory.showDialogMsg(title, message, 'md');

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