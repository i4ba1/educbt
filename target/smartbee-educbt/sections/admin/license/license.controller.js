(function() {

    'use strict';
    angular.module('app').controller('LicenseController', LicenseController);

    LicenseController.$inject = ['$scope', '$filter', 'ngTableParams', '$stateParams', '$state', 'storageService', 'errorHandle', 'licenseService', '$timeout', '$sce', 'DialogFactory'];

    function LicenseController($scope, $filter, ngTableParams, $stateParams, $state, storageService, errorHandle, licenseService, $timeout, $sce, DialogFactory) {

        var token = "";
        if (!storageService.isAuthorization("ADMIN")) {
            $state.go("checkroute");
        } else {
            token = storageService.getToken();
        }

        $scope.license = "";
        $scope.licenses = [];
        $scope.showModal = false;

        if ($state.is("admin.licenseMgmt.create")) {
            $scope.switchPanel = $stateParams.paramUrl;
            $scope.license = $stateParams.license;
            if (!$scope.license && $stateParams.paramUrl === "activation") {
                $state.go("admin.licenseMgmt");
            } else {

            }

        }

        $scope.submitActivationKey = function(license) {
            license.licenseStatus = true;
            var licenseCrud = licenseService.manualActivation(license, token).then(
                function(response) {
                    DialogFactory.showDialogMsg('Aktivasi Sukses', "serial number telah berhasil diaktifasi", "sm").then(
                        function() {},
                        function(dismiss) {
                            $state.go("admin.licenseMgmt");
                        }
                    )
                },
                function(errorResponse) {
                    console.log(errorResponse);
                    if (errorResponse.status === 417) {
                        DialogFactory.showDialogMsg('Aktivasi Gagal', "Kode Aktifasi Tidak Valid", "sm")
                    }
                }
            );
        }

        $scope.saveLicenseOnline = function(license) {
            var isSuccess = false;
            var promise = licenseService.register(license).then(
                function(response) {
                    isSuccess = true;
                },
                function(errorResponse) {
                    console.log(errorResponse);
                    if (errorResponse.status <= 0) {
                        DialogFactory.showDialogMsg('Koneksi Internet Bermasalah', "Harap periksa kembali koneksi internet Anda, agar dapat mendaftarkan serial number ini...!", "md");
                    } else if (errorResponse.status === 404) {
                        DialogFactory.showDialogMsg('Registrasi Gagal', "Serial Number ini sudah diaftarkan untuk server lain...", "md");
                    }
                }
            ).then(function() {
                if (isSuccess) {
                    $scope.saveLicense(license);
                }
            });

        };

        $scope.dummySave = function(license) {
            var isSuccess = false;
            var result = null;
            licenseService.dummySave(license, token).then(
                function(response) {
                    isSuccess = true;
                    result = response.data;
                },
                function(errorResponse) {
                    console.log(errorResponse);
                    DialogFactory.showDialogMsg('Registrasi Gagal', "Serial Number ini tidak valid", "sm");
                }
            ).then(function() {
                if (isSuccess) {
                    $scope.saveLicenseOnline(result);
                }
            });

        };

        $scope.saveLicense = function(license) {

            var promise = licenseService.saveLicense(license, token);
            promise.then(
                function(response) {
                    var message = "";
                    DialogFactory.showDialogMsg('Registrasi Berhasil', "Registrasi lisensi baru telah berhasil", "sm").then(
                        function() {},
                        function(dismiss) {
                            $state.go('^');
                        }
                    )

                },
                function(errorResponse) {
                    var message = "";
                    if (errorResponse.status == 404) {
                        message = "Lisensi yang anda masukan salah"
                    } else if (errorResponse.status == 409) {
                        message = "lisensi sudah pernah digunakan"
                    } else {
                        errorHandle.setError(errorResponse);
                    }
                    $scope.open('Gagal Simpan', [message]);
                });


        };

        $scope.onlineActivate = function(license) {
            var isSuccess = false;
            var result = licenseService.licenseCrud(license);
            result.then(function(response) {
                    isSuccess = true;
                    license.activationKey = response.data.activationKey;
                },
                function(errorResponse) {
                    var message = "";
                    if (errorResponse.status == 404) {
                        message = "Lisensi yang anda masukan salah";
                    } else if (errorResponse.status == 409) {
                        message = "lisensi sudah pernah digunakan";
                    } else if (errorResponse.status == 417) {
                        message = "lisensi tidak valid";
                    } else {
                        errorHandle.setError(errorResponse);
                    }
                    $scope.open('Gagal Simpan', [message]);
                }
            ).then(
                function() {
                    if (isSuccess) {
                        $scope.submitActivationKey(license);
                    }
                }
            );
        };

        $scope.isActive = function(activationKey) {
            if (activationKey) {
                return $sce.trustAsHtml('<span style="color:green;text-align:center;" title="teraktifasi"><i class="fa fa-check fa-fw fa-lg" aria-hidden="true"></i></span>');
            } else {
                return $sce.trustAsHtml('<span style="color:red;text-align:center;" title="belum teraktifasi"><i class="fa fa-times fa-fw fa-lg" aria-hidden="true"></i></span>');
            }
        }

        $scope.activation = function(license) {
            DialogFactory.licenseActivation().then(function(response) {
                if (response === "internet") {
                    $scope.onlineActivate(license);
                } else {
                    $state.go("admin.licenseMgmt.create", {
                        paramUrl: "activation",
                        license: license
                    })
                }
            }, function() {})
        }

        $scope.open = DialogFactory.showErrorMsg;

        $scope.toggleModal = function(license) {
            $scope.license = license;
            DialogFactory.confDialogMsg('Konfirmasi Hapus Data', 'Apakah anda yakin untuk menghapus kode lisensi?', 'md')
                .then(function(response) {
                    if (response) {
                        $scope.delete();
                    }
                }, function(dismiss) {});
        }

        /*
         *This Function used to fetch all teacher data
         */
        function findAllLicense() {
            var promise = licenseService.fetchAllLicense(token);
            promise.then(
                function(response) {
                    $scope.licenses = response.data;
                    updateTableData($scope.licenses);
                },
                function(errorResponse) {
                    errorHandle.setError(errorResponse);
                    $scope.licenses = new Array();
                    updateTableData($scope.licenses);
                }
            );
        };

        $scope.delete = function() {
            var promise = licenseService.deleteLicense($scope.license.id, token);
            promise.then(
                function(response) {
                    $scope.showModal = false;
                    findAllLicense();
                },
                function(errorResponse) {
                    errorHandle.setError(errorResponse);
                });
        };

        $scope.licenseTable = new ngTableParams();

        /*$scope.
         * function to update ngTableParams in to show all class
         */
        function updateTableData(data_table) {
            $scope.licenseTable = new ngTableParams({
                page: 1,
                count: 10
            }, {
                getData: function($defer, params) {
                    var data = params.sorting() ? $filter('orderBy')(data_table,
                        params.orderBy()) : data_table;
                    data = params.filter() ? $filter('filter')(data,
                        params.filter()) : data;
                    data = data.slice((params.page() - 1) * params.count(),
                        params.page() * params.count());
                    $defer.resolve(data);
                },
                total: data_table.length
            });
        };

        if ($state.is('admin.licenseMgmt')) {
            findAllLicense();
        } else {

        }
    }

})();