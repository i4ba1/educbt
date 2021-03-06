(function() {

    'use strict';
    angular.module('app').controller('TeacherController', TeacherController);

    TeacherController.$inject = ['$scope', '$filter', 'ngTableParams', '$stateParams', '$state', 'teacherService', 'storageService', 'errorHandle', '$timeout', 'DialogFactory', 'bsLoadingOverlayService'];

    function TeacherController($scope, $filter, ngTableParams, $stateParams, $state, teacherService, storageService, errorHandle, $timeout, DialogFactory, bsLoadingOverlayService) {
        var token = " ";
        /*
         * checking authorization
         */

        if (!storageService.isAuthorization("ADMIN")) {
            $state.go("checkroute");
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
            bsLoadingOverlayService.start({
                referenceId: 'loading'
            });
            var promise = teacherService.importTeacher(params);
            promise.then(
                function(response) {
                    $timeout(function() {
                        bsLoadingOverlayService.stop({
                            referenceId: 'loading'
                        });
                        $state.go('admin.teacherMgmt');
                    }, 500);
                },
                function(errorResponse) {
                    $timeout(function() {
                        bsLoadingOverlayService.stop({
                            referenceId: 'loading'
                        });
                        if (errorResponse.status == 409) {
                            $scope.open("Gagal Simpan", ["NIP guru sudah digunakan", "Silahkan gunakan NIP yang berbeda"]);
                        }
                    }, 1000);
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
            $scope.selectedTeacher = teacher;
            DialogFactory.confDialogMsg('Konfirmasi Hapus Data', 'Apakah anda yakin untuk menghapus data guru?', 'md')
                .then(function(response) {
                    if (response) {
                        $scope.delete();
                    }
                }, function(dismiss) {});
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

                if ($scope.csv.result.length > 0 && $scope.csv.result[0].NIP) {

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
                } else {
                    $scope.open('Berkas CSV tidak valid', ['Berkas CSV yang diunggah tidak sesuai dengan format standar, silahkan lihat template yang telah disediakan.']);
                }

            }

            $scope.reupload = function() {
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
                $scope.data = undefined;
                document.getElementById('importForm').reset();
            }

        } else if ($state.is('admin.teacherMgmt.teacherDetail')) {
            if ($stateParams.teacherNip != undefined && $stateParams.teacherNip != null && $stateParams.teacherNip != "") {
                findTeacher($stateParams.teacherNip);
                $scope.isUpdate = true;
            } else {
                $scope.isUpdate = false;
            }
        }

        $scope.open = DialogFactory.showErrorMsg;

    }

})();