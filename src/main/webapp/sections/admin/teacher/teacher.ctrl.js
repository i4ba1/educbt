'use strict';
angular
    .module('app.core')
    .controller('TeacherController', function($scope, $filter, ngTableParams, $stateParams, $state, teacherService, storageService, errorHandle, $timeout, $uibModal) {
        var token = " ";
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
        $scope.selectedTeacher = {};
        $scope.teachers = [];
        $scope.teachersTable = new ngTableParams();
        $scope.data = null;
        $scope.isUpdate = false;
        $scope.showModal = false;
        $scope.showModalLoading = false;
        $scope.importData = [];

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

        /*
         *This Function used to fetch all teacher data
         */
        function findAll() {
            var promise = teacherService.fetchAllTeacher(token);
            promise.then(
                function(response) {
                    $scope.teachers = response.data;
                },
                function(errorResponse) {
                    errorHandle.setError(errorResponse);
                }
            ).then(
                function() {
                    updateTeacherTable($scope.teachers);
                }
            );
        };

        /*
         *This Function used to find teacher by NIP
         *@param teacher.nip
         */
        function findTeacher(nip) {
            var promise = teacherService.findTeacher(nip, token);
            promise.then(
                function(response) {
                    $scope.selectedTeacher = response.data;
                    $scope.selectedTeacher.birthDate = new Date(response.data.birthDate);
                    $scope.selectedTeacher.joiningDate = new Date(response.data.joiningDate);
                },
                function(errorResponse) {
                    errorHandle.setError(errorResponse);
                }
            );
        };

        /*
         *This Function used save or update
         *SAVING when $scope.isUpdate equal false
         *and UPDATING when $scope.isUpdate equal true
         */
        $scope.saveOrUpdate = function() {
            var params = [];
            var param = {};
            var promise;

            param.authorization = token;
            param.teacher = $scope.selectedTeacher;

            if ($scope.selectedTeacher.birthDate instanceof Date) {
                param.teacher.birthDate = $scope.selectedTeacher.birthDate.getTime();
            } else {
                param.teacher.birthDate = $scope.selectedTeacher.birthDate;
            }

            if ($scope.selectedTeacher.joiningDate instanceof Date) {
                param.teacher.joiningDate = $scope.selectedTeacher.joiningDate.getTime();
            } else {
                param.teacher.joiningDate = $scope.selectedTeacher.joiningDate;
            }
            params.push(param);

            if ($scope.isUpdate) {
                promise = teacherService.updateTeacher(params);
                promise.then(
                    function(response) {
                        $state.go('admin.teacherMgmt');
                    },
                    function(errorResponse) {
                        errorHandle.setError(errorResponse);
                    });

            } else {
                promise = teacherService.createTeacher(params);
                promise.then(
                    function(response) {
                        $state.go('admin.teacherMgmt');
                    },
                    function(errorResponse) {
                        if (errorResponse.status == 409) {
                            $scope.open("Gagal Simpan", ["NIP guru sudah digunakan", "Silahkan gunakan NIP yang berbeda"]);
                        } else {
                            errorHandle.setError(errorResponse);
                        }
                    });
            }
        };

        /*
         * used for deleting Selected Teacher by TeacherID
         */
        $scope.delete = function() {
            var promise = teacherService.deleteTeacher($scope.selectedTeacher.nip, token);
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
         *This Function used for importing teacher data from file.csv
         */
        $scope.importTeacher = function() {
            var params = [];
            var param = {};
            param.authorization = token;
            param.teachers = $scope.importData;
            params.push(param);
            $scope.showModalLoading = true;
            var promise = teacherService.importTeacher(params);
            promise.then(
                function(response) {
                    $scope.showModalLoading = false;
                    $timeout(function() {
                        $state.go('admin.teacherMgmt');
                    }, 500);
                },
                function(errorResponse) {
                    $scope.showModalLoading = false;
                    if (errorResponse.status == 409) {
                        $timeout(function() {
                            $scope.open("Gagal Simpan", ["NIP guru sudah digunakan", "Silahkan gunakan NIP yang berbeda"]);
                        }, 1000);
                    }
                    errorHandle.setError(errorResponse);
                });
        };

        /*
         * used for updating teacherTableParams for show all exis teacher data
         */
        function updateTeacherTable(teacherData) {

            $scope.teachersTable = new ngTableParams({
                page: 1,
                count: 10
            }, {
                getData: function($defer, params) {
                    $scope.data = params.sorting() ? $filter('orderBy')(teacherData,
                        params.orderBy()) : teacherData;
                    $scope.data = params.filter() ? $filter('filter')($scope.data,
                        params.filter()) : $scope.data;
                    $scope.data = $scope.data.slice((params.page() - 1) * params.count(),
                        params.page() * params.count());
                    $defer.resolve($scope.data);
                },
                total: teacherData.length
            });

        }

        /*
         * used for show delete confirmation dialog
         */
        $scope.toggleModal = function(teacher) {
            $scope.showModal = !$scope.showModal;
            $scope.selectedTeacher = teacher;
        }

        /*
         * routing state
         */
        if ($state.is('admin.teacherMgmt')) {
            findAll();

        } else if ($state.is('admin.teacherImport')) {

            $scope.download = function(resource) {
                window.open(resource);
            }

            $scope.updateData = function() {
                $scope.importData = [];
                $scope.csv.result.forEach(function(row) {
                    switch (row.STATUS_PERNIKAHAN.toString().toUpperCase()) {
                        case "MENIKAH":
                            row.STATUS_PERNIKAHAN = 'MARRIED';
                            break;
                        case "CERAI":
                            row.STATUS_PERNIKAHAN = 'DIVORCE';
                            break;
                        default:
                            row.STATUS_PERNIKAHAN = 'SINGLE';
                    }

                    switch (row.AGAMA.toString().toUpperCase()) {
                        case "KATOLIK":
                            row.AGAMA = 'CHRISTIAN';
                            break;
                        case "KRISTEN":
                            row.AGAMA = 'PROTESTANT';
                            break;
                        case "BUDHA":
                            row.AGAMA = 'BUDDHA';
                            break;
                        case "HINDU":
                            row.AGAMA = 'HINDU';
                            break;
                        default:
                            row.AGAMA = 'ISLAM';
                    }

                    var newRow = {
                        active: (row.MASIH_AKTIF_BEKERJA.toString().toUpperCase() === 'YA' ? true : false),
                        address: row.ALAMAT,
                        birthDate: row.TANGGAL_LAHIR,
                        birthPlace: row.TEMPAT_LAHIR,
                        email: row.EMAIL,
                        firstName: row.NAMA_DEPAN,
                        gender: (row.JENIS_KELAMIN.toUpperCase() === 'L' ? 'MALE' : 'FEMALE'),
                        jobTitle: row.NAMA_PEKERJAAN,
                        joiningDate: row.TANGGAL_MASUK,
                        lastName: row.NAMA_BELAKANG,
                        maritalStatus: row.STATUS_PERNIKAHAN,
                        mobilePhone: row.NO_HP,
                        nip: row.NIP,
                        phone: row.TELEPON,
                        religion: row.AGAMA,
                    }

                    $scope.importData.push(newRow);
                });

                updateTeacherTable($scope.importData);
            }

        } else if ($state.is('admin.teacherMgmt.teacherDetail')) {
            if ($stateParams.teacherNip != undefined && $stateParams.teacherNip != null && $stateParams.teacherNip != "") {
                findTeacher($stateParams.teacherNip);
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