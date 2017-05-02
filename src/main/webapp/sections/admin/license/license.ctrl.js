'use strict';
angular
    .module('app.core')
    .controller('LicenseController', function($scope, $filter, ngTableParams, $stateParams, $state, storageService, errorHandle, licenseService, $timeout, $uibModal, $sce) {

        var token = "";
        if (!storageService.isAuthorization("ADMIN")) {
            $state.go("checkroute");
        } else {
            token = storageService.getToken();
        }

        $scope.license = "";
        $scope.licenses = [];
        $scope.showModal = false;
        $scope.switchPanel = $stateParams.paramUrl;

        $scope.saveLicense = function(license) {
            var promise = licenseService.saveLicense(license, token);
            promise.then(
                function(response) {
                    var message = "";
                    $scope.open('Registrasi Berhasil', []);
                    $state.go('^');
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

        $scope.onlineActivate = function() {
            var licenseCrud = licenseService.licenseCrud($scope.license);
            licenseCrud.save({ serialNumber: $scope.license }, function(response) {

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
            );
        };

        $scope.isActive = function(activationKey) {

            if (activationKey) {
                return $sce.trustAsHtml('<span style="color:green;text-align:center;" title="teraktifasi"><i class="fa fa-check fa-fw fa-lg" aria-hidden="true"></i></span>');
            } else {
                return $sce.trustAsHtml('<span style="color:red;text-align:center;" title="belum teraktifasi"><i class="fa fa-times fa-fw fa-lg" aria-hidden="true"></i></span>');
            }
        }

        $scope.open = function(title, messages) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'components/modal-template/error.html',
                controller: 'ModalInstanceCtrl',
                size: 'sm',
                resolve: {
                    modalData: function() {
                        return {
                            title: title,
                            messages: messages,
                            content: ''
                        };
                    }
                }
            });
        };

        $scope.toggleModal = function(license) {
            $scope.license = license;
            $scope.showModal = !$scope.showModal;
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
    });