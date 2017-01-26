'use strict';
angular
    .module('app.core')
    .controller('ClassController', function($scope, $filter, ngTableParams, $stateParams, $state, classService, storageService, errorHandle, $timeout, $uibModal, SortFactory) {

        var token = "";

        /*
         * checking authorization
         */
        if (!storageService.isAuthorization("ADMIN")) {
            $state.go("login");
        } else {
            token = storageService.getToken();
        }

        /*
         * Global / Scope variable
         * All Variable Declared in here first time
         */
        $scope.classes = [];

        $scope.csv = {
            content: null,
            header: true,
            headerVisible: true,
            separator: ',',
            separatorVisible: true,
            result: null,
            encoding: 'ISO-8859-1',
            encodingVisible: true,
        };

        $scope.classTable = null;
        $scope.data = null;
        $scope.selectedClass = null;
        $scope.isUpdate = false;
        $scope.showModal = false;
        $scope.showModalLoading = false;


        /*
         *This Function used to fetch all teacher data
         */
        function findAll() {
            var promise = classService.fetchAllClass(token);
            promise.then(
                function(response) {
                    $scope.classes = SortFactory.sortArr(response.data, 'className', 'asc');
                    updateTableData($scope.classes);
                },
                function(errorResponse) {
                    errorHandle.setError(errorResponse);
                }
            );
        };

        /*
         * find class by classID used while editing class
         */
        function findClass(id) {
            var promise = classService.findClass(id, token);
            promise.then(
                function(response) {
                    $scope.selectedClass = response.data;
                },
                function(errorResponse) {
                    errorHandle.setError(errorResponse);
                });
        };

        /*
         *This Function used save or update
         *SAVING when $scope.isUpdate equal false
         *and UPDATING when $scope.isUpdate equal true
         */
        $scope.saveOrUpdate = function() {
            var promise;
            var params = [];
            var param = {};
            param.authorization = token;
            param.kelas = $scope.selectedClass;
            params.push(param);

            if ($scope.isUpdate) {
                promise = classService.updateClass(params);
                promise.then(
                    function(response) {
                        $state.go('admin.classMgmt');
                    },
                    function(errorRespon) {
                        errorHandle.setError(errorResponse);
                    });
            } else {
                promise = classService.createClass(params);
                promise.then(
                    function(response) {
                        $state.go('admin.classMgmt');
                    },
                    function(errorResponse) {
                        errorHandle.setError(errorResponse);
                        $scope.open('Gagal Simpan', ["Data kelas sudah pernah disimpan"]);
                    });
            }
        };

        /*
         * function to deleteting selectedClass by class id
         */
        $scope.delete = function() {
            var promise = classService.deleteClass($scope.selectedClass.id, token);
            promise.then(
                function(response) {
                    $scope.showModal = false;
                    findAll();
                },
                function(errorResponse) {
                    errorHandle.setError(errorResponse);
                });
        };

        /*
         * Toggle modal to show delete confirmation
         */
        $scope.toggleModal = function(kelas) {
            $scope.showModal = !$scope.showModal;
            $scope.selectedClass = kelas;
        }

        /*
         * function to import all class
         */
        $scope.importClass = function() {
            var params = [];
            var param = {};
            param.authorization = token;
            param.classes = $scope.csv.result;
            params.push(param);
            var promise = classService.importClass(params);
            $scope.showModalLoading = true;
            promise.then(
                function(response) {
                    $scope.showModalLoading = false;
                    $timeout(function() {
                        $state.go('admin.classMgmt');
                    }, 500);
                },
                function(errorResponse) {
                    $scope.showModalLoading = false;
                    if (errorResponse.status == 409) {
                        $timeout(function() {
                            $scope.open('Gagal Simpan', ["Data kelas sudah pernah disimpan"]);
                        }, 1000);
                    }
                    errorHandle.setError(errorResponse);
                });
        }

        /*
         * function to update ngTableParams in to show all class
         */
        function updateTableData(data_table) {
            $scope.classTable = new ngTableParams({
                page: 1,
                count: 10
            }, {
                getData: function($defer, params) {
                    $scope.data = params.sorting() ? $filter('orderBy')(data_table,
                        params.orderBy()) : data_table;
                    $scope.data = params.filter() ? $filter('filter')($scope.data,
                        params.filter()) : $scope.data;
                    $scope.data = $scope.data.slice((params.page() - 1) * params.count(),
                        params.page() * params.count());
                    $defer.resolve($scope.data);
                },
                total: data_table.length
            });

        }

        /*
         * this function used for validating csv data,
         * checking null className to be remove
         */
        function validateImport(csv_result) {
            var valid_data = [];
            angular.forEach(csv_result, function(data) {
                if (data.className != null && data.className != undefined && data.className != "") {
                    valid_data.push(data);
                }
            });
            return valid_data;
        }


        /*
         * state for conditioning routing
         */
        if ($state.is('admin.classMgmt')) {
            findAll();

        } else if ($state.is('admin.classImport')) {

            $scope.download = function(resource) {
                window.open(resource);
            }

            $scope.updateData = function() {
                $scope.csv.result = validateImport($scope.csv.result)
                updateTableData($scope.csv.result);

            }
        } else if ($state.is('admin.classMgmt.classDetail')) {
            if ($stateParams.classId != undefined && $stateParams.classId != null && $stateParams.classId != "") {
                findClass($stateParams.classId);
                $scope.isUpdate = true;
            } else {
                $scope.isUpdate = false;
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

    });