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
(function() {

    'use strict';
    angular.module('app').controller('StudentController', StudentController);

    StudentController.$inject = ['$scope', '$filter', 'ngTableParams', '$stateParams', '$state', 'studentService', 'classService', '$timeout', 'storageService', 'errorHandle', 'bsLoadingOverlayService', 'DialogFactory'];

    function StudentController($scope, $filter, ngTableParams, $stateParams, $state, studentService, classService, $timeout, storageService, errorHandle, bsLoadingOverlayService, DialogFactory) {

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

        $scope.studentTable = null;
        $scope.students = [];
        $scope.data = null;
        $scope.isUpdate = false;
        $scope.selectedStudent = {
            "firstName": "",
            "lastName": "",
            "email": "",
            "address": "",
            "birthPlace": "",
            "birthDate": "",
            "mobilePhone": "",
            "phone": "",
            "gender": "",
            "religion": "",
            "deleted": false,
            "nis": "",
            "kelas": {
                "id": 0,
                "className": "",
                "createdDate": "",
                "activated": true,
                "events": null
            }
        };
        $scope.showModal = false;
        $scope.showModalLoading = false;
        $scope.classID = "";
        $scope.importData = [];

        /*
         *This Function used to fetch all student data
         */
        function findAll() {
            var promise = studentService.fetchAllStudents(token);
            promise.then(
                function(response) {
                    $scope.students = response.data;
                },
                function(errorResponse) {
                    errorHandle.setError(errorResponse);
                }
            ).then(function() {
                updateTableData($scope.students);
            });

        };

        /*
         *This Function used to find student by NIS
         *@param student.nis
         */
        function findStudent(nis) {
            var promise = studentService.findStudent(nis, token);
            promise.then(
                function(response) {
                    $scope.selectedStudent = response.data;
                    $scope.selectedStudent.birthDate = new Date(response.data.birthDate);
                    $scope.classID = "" + response.data.kelas.id;
                },
                function(errorResponse) {
                    errorHandle.setError(errorResponse);
                }
            );
        };

        /*
         *This Function used to import all student from file.csv
         */
        $scope.importStudent = function() {
            var params = [{
                authorization: token,
                students: $scope.importData
            }];
            bsLoadingOverlayService.start({
                referenceId: 'loading'
            });
            var promise = studentService.importStudent(params);
            promise.then(
                function(response) {
                    $timeout(function() {
                        bsLoadingOverlayService.stop({
                            referenceId: 'loading'
                        });
                        $state.go('admin.studentMgmt');
                    }, 500);
                },
                function(errorResponse) {
                    $timeout(function() {
                        bsLoadingOverlayService.stop({
                            referenceId: 'loading'
                        });
                        if (errorResponse.status == 409) {
                            $scope.open("Gagal Simpan", ["NIS siswa sudah digunakan", "Silahkan gunakan NIS yang berbeda"]);
                        }
                    }, 3000);
                    errorHandle.setError(errorResponse);
                });
        }

        /*
         *This Function used save or update
         *SAVING when $scope.isUpdate equal false
         *and UPDATING when $scope.isUpdate equal true
         */
        $scope.saveOrUpdate = function() {
            var promise = classService.findClass($scope.classID, token);

            promise.then(
                function(response) {
                    $scope.selectedStudent.kelas = response.data;
                },
                function(errorResponse) {}
            ).then(
                function() {
                    var promise2 = null;
                    var params = [];
                    var param = {};
                    param.authorization = token;
                    param.student = $scope.selectedStudent;
                    if ($scope.selectedStudent.birthDate instanceof Date) {
                        param.student.birthDate = $scope.selectedStudent.birthDate.getTime();
                    } else {
                        param.student.birthDate = $scope.selectedStudent.birthDate;
                    }
                    params.push(param);

                    if ($scope.isUpdate) {
                        promise2 = studentService.updateStudent(params);
                        promise2.then(
                            function(response) {
                                $state.go('admin.studentMgmt');
                            },
                            function(errorResponse) {
                                errorHandle.setError(errorResponse);
                            });
                    } else {
                        promise2 = studentService.createStudent(params);
                        promise2.then(
                            function(response) {
                                $state.go('admin.studentMgmt');
                            },
                            function(errorResponse) {
                                if (errorResponse.status == 409) {
                                    $scope.open("Gagal Simpan", ["NIS siswa sudah digunakan", "Silahkan gunakan NIS yang berbeda"]);
                                } else {
                                    errorHandle.setError(errorResponse);
                                }
                            });
                    }
                }
            );
        };

        $scope.delete = function() {
            var promise = studentService.deleteStudent($scope.selectedStudent.nis, token);
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
         *This Function for toggle modal to show delete confirmation
         */
        $scope.toggleModal = function(student) {

            $scope.selectedStudent = student;
            DialogFactory.confDialogMsg('Konfirmasi Hapus Data', 'Apakah anda yakin untuk menghapus data siswa?', 'md')
                .then(function(response) {
                    if (response) {
                        $scope.delete();
                    }
                }, function(dismiss) {});
        };

        /*
         * used for update ngTableParams to show all Studnet in table
         */
        function updateTableData(data_table) {
            $scope.studentTable = new ngTableParams({
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
         * State of Routing,
         */
        if ($state.is('admin.studentMgmt')) {
            findAll();
        } else if ($state.is('admin.studentImport')) {
            $scope.download = function(resource) {
                window.open(resource);
            }

            $scope.updateData = function() {

                if ($scope.csv.result.length > 0 && $scope.csv.result[0].NIS) {
                    $scope.importData = [];
                    $scope.csv.result.forEach(function(row) {
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
                            nis: row.NIS,
                            firstName: row.NAMA_DEPAN,
                            lastName: row.NAMA_BELAKANG,
                            address: row.ALAMAT,
                            birthPlace: row.TEMPAT_LAHIR,
                            birthDate: row.TANGGAL_LAHIR,
                            phone: row.TELEPON,
                            mobilePhone: row.NO_HP,
                            gender: (row.JENIS_KELAMIN.toUpperCase() === 'L' ? 'MALE' : 'FEMALE'),
                            religion: row.AGAMA,
                            email: row.EMAIL,
                            kelas: row.KELAS
                        }

                        $scope.importData.push(newRow);
                    });
                    updateTableData($scope.importData);
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

        } else if ($state.is('admin.studentMgmt.studentDetail')) {
            if ($stateParams.studentNis != undefined && $stateParams.studentNis != null && $stateParams.studentNis != "") {
                findStudent($stateParams.studentNis);
                $scope.isUpdate = true;
            } else {
                $scope.isUpdate = false;
            }
        }

        $scope.open = DialogFactory.showErrorMsg;

    }

})();
(function() {
    'use strict';

    angular.module('app').controller('ClassController', ClassController);

    ClassController.$inject = ['$scope', '$filter', 'ngTableParams', '$stateParams', '$state', 'classService', 'storageService', 'errorHandle', '$timeout', 'bsLoadingOverlayService', 'DialogFactory'];

    function ClassController($scope, $filter, ngTableParams, $stateParams, $state, classService, storageService, errorHandle, $timeout, bsLoadingOverlayService, DialogFactory) {

        var token = "";

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
                    $scope.classes = response.data;
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
            DialogFactory.confDialogMsg('Konfirmasi Hapus Data', 'Apakah anda yakin untuk menghapus data kelas?', 'md')
                .then(function(response) {
                    if (response) {
                        $scope.selectedClass = kelas;
                        $scope.delete();
                    }
                }, function(dismiss) {});
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
            bsLoadingOverlayService.start({
                referenceId: 'loading'
            });
            promise.then(
                function(response) {
                    $timeout(function() {
                        bsLoadingOverlayService.stop({
                            referenceId: 'loading'
                        });
                        $state.go('admin.classMgmt');
                    }, 500);
                },
                function(errorResponse) {
                    $timeout(function() {
                        bsLoadingOverlayService.stop({
                            referenceId: 'loading'
                        });
                        if (errorResponse.status == 409) {
                            $scope.open('Gagal Simpan', ["Data kelas sudah pernah disimpan"]);
                        }
                    }, 3000);
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
                if (data.NAMA_KELAS != null && data.NAMA_KELAS != undefined && data.NAMA_KELAS != "") {
                    valid_data.push({ className: data.NAMA_KELAS });
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
                if ($scope.csv.result.length > 0 && $scope.csv.result[0].NAMA_KELAS) {
                    $scope.csv.result = validateImport($scope.csv.result)
                    updateTableData($scope.csv.result);
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
        } else if ($state.is('admin.classMgmt.classDetail')) {
            if ($stateParams.classId != undefined && $stateParams.classId != null && $stateParams.classId != "") {
                findClass($stateParams.classId);
                $scope.isUpdate = true;
            } else {
                $scope.isUpdate = false;
            }
        }

        $scope.open = DialogFactory.showErrorMsg;

    }

})();
(function() {

    'use strict';
    angular.module('app').controller('SubjectController', SubjectController);

    SubjectController.$inject = ['$scope', '$filter', 'ngTableParams', '$stateParams', '$state', 'subjectService', 'storageService', 'errorHandle', '$timeout', 'DialogFactory', 'bsLoadingOverlayService'];

    function SubjectController($scope, $filter, ngTableParams, $stateParams, $state, subjectService, storageService, errorHandle, $timeout, DialogFactory, bsLoadingOverlayService) {

        /*
         * checking authorization
         */

        var token = " ";
        if (!storageService.isAuthorization("ADMIN")) {
            $state.go("checkroute");
        } else {
            token = storageService.getToken();
        }

        /*
         * Global / Scope variable
         * All Variable Declared in here first time
         */
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

        $scope.subjectsTable = null;
        $scope.data = null;
        $scope.subjects = null;
        $scope.selectedSubject = null;
        $scope.isUpdate = false;
        $scope.showModal = false;
        $scope.showModalLoading = false;
        $scope.index = 0;
        $scope.isAdd = true;


        /*
         *This Function used to fetch all teacher data
         */
        function findAll() {
            var promise = subjectService.fetchAllSubject(token);
            promise.then(
                    function(response) {
                        $scope.subjects = response.data;
                    },
                    function(errorResponse) {
                        errorHandle.setError(errorResponse);
                    })
                .then(function() {
                    updateTableData($scope.subjects);
                });
        };

        /*
         * fin subject by subject id to editing selected subject
         */
        function findSubject(id) {
            var promise = subjectService.findSubject(id, token);
            promise.then(
                function(response) {
                    $scope.selectedSubject = response.data;
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
            param.subject = $scope.selectedSubject;

            params.push(param);

            if ($scope.isUpdate) {
                promise = subjectService.updateSubject(params);
                promise.then(
                    function(response) {
                        $state.go('admin.subjectMgmt');
                    },
                    function(errorResponse) {
                        errorHandle.setError(errorResponse);
                    });
            } else {
                promise = subjectService.createSubject(params);
                promise.then(
                    function(response) {
                        $state.go('admin.subjectMgmt');
                    },
                    function(errorResponse) {
                        if (errorResponse.status == 409) {
                            $scope.open("Gagal Simpan", ["matapelajaran sudah pernah dibuat"]);
                        } else {
                            errorHandle.setError(errorResponse);
                        }
                    });
            }
        };

        /*
         * used for deleting selected subject by subject id
         */
        $scope.delete = function() {
            var promise = subjectService.deleteSubject($scope.selectedSubject.id, token);
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
         * used for show delete confirmation dialog
         */
        $scope.toggleModal = function(subject) {
            $scope.selectedSubject = subject;
            DialogFactory.confDialogMsg('Konfirmasi Hapus Data', 'Apakah anda yakin untuk menghapus matapelajaran ?', 'md')
                .then(function(response) {
                    if (response) {
                        $scope.delete();
                    }
                }, function(dismiss) {});
        }

        /*
         * used for importing subject by CSV file
         */
        $scope.importSubject = function() {
            var params = [];
            var param = {};
            param.authorization = token;
            param.subjects = $scope.csv.result;
            params.push(param);
            bsLoadingOverlayService.start({
                referenceId: 'loading'
            });
            var promise = subjectService.importSubject(params);
            promise.then(
                function(response) {
                    $timeout(function() {
                        bsLoadingOverlayService.stop({
                            referenceId: 'loading'
                        });
                        $state.go('admin.subjectMgmt');
                    }, 500);
                },
                function(errorResponse) {
                    $timeout(function() {
                        bsLoadingOverlayService.stop({
                            referenceId: 'loading'
                        });
                        if (errorResponse.status == 409) {
                            $scope.open("Gagal Simpan", ["matapelajaran sudah pernah dibuat"]);
                        }
                    }, 3000);
                    errorHandle.setError(errorResponse);
                });
        };

        /*
         * Used for revalidate  null subject name
         */
        function validateImport(csv_result) {
            var valid_data = [];
            angular.forEach(csv_result, function(data) {
                if (data.NAMA_MATAPELAJARAN != null && data.NAMA_MATAPELAJARAN != undefined && data.NAMA_MATAPELAJARAN != "") {
                    valid_data.push({ subjectName: data.NAMA_MATAPELAJARAN });
                }
            });
            return valid_data;
        };

        /*
         * used for update subjectTableParams to show all subject
         */
        function updateTableData(data_table) {
            $scope.subjectsTable = new ngTableParams({
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
        };

        /*
         * state of routing
         */
        if ($state.is('admin.subjectMgmt')) {
            findAll();
        } else if ($state.is('admin.subjectImport')) {

            $scope.download = function(resource) {
                window.open(resource);
            }

            $scope.updateData = function() {
                if ($scope.csv.result.length > 0 && $scope.csv.result[0].NAMA_MATAPELAJARAN) {
                    $scope.csv.result = validateImport($scope.csv.result);
                    updateTableData($scope.csv.result);
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

        } else if ($state.is('admin.subjectMgmt.subjectDetail')) {
            if ($stateParams.subjectId != undefined && $stateParams.subjectId != null && $stateParams.subjectId != "") {
                findSubject($stateParams.subjectId);
                $scope.isUpdate = true;
            } else {
                $scope.isUpdate = false;
            }
        }

        $scope.open = DialogFactory.showErrorMsg;

    }

})();
(function() {

    'use strict';

    angular.module('app').controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$scope', '$state', 'storageService'];

    function DashboardController($scope, $state, storageService) {
        /*
         * checking authorization
         */
        if (!storageService.isAuthorization("ADMIN")) {
            $state.go("checkroute");
        }

        $scope.dashboardRoute = function(params) {
            if (params == 'teacher') {
                $state.go('admin.teacherMgmt');
            } else if (params == 'student') {
                $state.go('admin.studentMgmt');
            } else if (params == 'class') {
                $state.go('admin.classMgmt');
            } else if (params == 'subject') {
                $state.go('admin.subjectMgmt');
            }
        }

    }
})();
(function() {

    'use strict';
    angular.module('app').controller('SchoolProfileController', SchoolProfileController);

    SchoolProfileController.$inject = ['$scope', 'schoolProfileService', '$state', 'storageService', 'errorHandle'];

    function SchoolProfileController($scope, schoolProfileService, $state, storageService, errorHandle) {

        /*
         * checking authorization
         */
        var token = " ";
        if (!storageService.isAuthorization("ADMIN")) {
            $state.go("checkroute");
        } else {
            token = storageService.getToken();
        }


        $scope.profile = {
            id: "",
            schoolName: "",
            schoolDescription: "",
            file: null
        };

        $scope.tinyMce = {};
        var varMenu = {
            file: {
                title: 'File',
                items: 'newdocument'
            },
            edit: {
                title: 'Edit',
                items: 'undo redo | cut copy paste | selectall'
            },
            insert: {
                title: 'Insert',
                items: 'charmap'
            },
            format: {
                title: 'Format',
                items: 'bold italic underline strikethrough superscript subscript | formats | removeformat'
            },
            table: {
                title: 'Table',
                items: 'inserttable tableprops deletetable | cell row column'
            },
            tools: {
                title: 'Tools',
                items: 'spellchecker code'
            }
        };

        var themeAdvancedFonts =
            "Andale Mono=andale mono,times;" +
            "Arial=arial,helvetica,sans-serif;" +
            "Arial Black=arial black,avant garde;" +
            "Book Antiqua=book antiqua,palatino;" +
            "Comic Sans MS=comic sans ms,sans-serif;" +
            "Courier New=courier new,courier;" +
            "Georgia=georgia,palatino;" +
            "Helvetica=helvetica;" +
            "Impact=impact,chicago;" +
            "Symbol=symbol;" +
            "Tahoma=tahoma,arial,helvetica,sans-serif;" +
            "Terminal=terminal,monaco;" +
            "Times New Roman=times new roman,times;" +
            "Trebuchet MS=trebuchet ms,geneva;" +
            "Verdana=verdana,geneva;" +
            "Webdings=webdings;" +
            "Wingdings=wingdings,zapf dingbats";

        var themeFontSize = '8pt 10pt 12pt 14pt 18pt 24pt 36pt';
        var plugins = [
            'advlist autolink lists link image charmap print preview hr anchor pagebreak',
            'searchreplace wordcount visualblocks visualchars code fullscreen',
            'insertdatetime media nonbreaking save table contextmenu directionality',
            'emoticons template paste textcolor colorpicker textpattern imagetools'
        ];
        // var menubar = 'file edit insert format table';
        var menubar = '';
        var toolbar = 'undo redo |  bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent ';
        var toolbar2 = 'fontselect fontsizeselect | forecolor backcolor | table charmap link';

        $scope.tinyMceConfig = {
            selector: 'textarea',
            height: 250,
            menu: varMenu,
            menubar: menubar,
            plugins: plugins,
            toolbar1: toolbar,
            toolbar2: toolbar2,
            image_advtab: true,
            font_formats: themeAdvancedFonts,
            fontsize_formats: themeFontSize,
            resize: false
        };

        $scope.file = null;
        $scope.isUpdate = false;
        $scope.image = "";

        /*
         * there is any bugs when update image...
         */

        function fetchScoolProfile() {
            var promise = schoolProfileService.fetchProfile(token);
            promise.then(
                function(response) {
                    $scope.isUpdate = true;
                    $scope.profile.id = response.data.id;
                    $scope.profile.schoolName = response.data.schoolName;
                    $scope.profile.schoolDescription = response.data.schoolDescription;
                    $scope.image = 'data:' + response.data.contentType + ';base64,' + response.data.fileData;
                    var blob = response.data.fileData;
                    $scope.file = new File([blob], response.data.fileName, {
                        type: response.data.contentType
                    });
                    console.log("Image" + $scope.file);
                },
                function(error) {
                    if (error.status == 404) {
                        $scope.isUpdate = false;
                        $scope.image = 'images/profile.png'
                    } else {
                        errorHandle.setError(error);
                    }
                }
            );
            return promise;
        };

        $scope.submit = function() {
            $scope.profile.file = $scope.file;
            var promise = schoolProfileService.saveOrUpdateProfile($scope.profile, $scope.isUpdate, token);
            promise.then(function() {
                $state.go("^")
            });
        };

        fetchScoolProfile();
    }

})();
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
                        message = "Koneksi internet dibutuhkan untuk mendaftarkan lisensi."
                        errorHandle.setError(errorResponse);
                    }
                    $scope.open('Gagal Simpan', [message]);
                });


        };

        $scope.onlineActivate = function(license) {
            var isSuccess = false;
            var result = licenseService.activateByInternet(license, token);
            console.log("response======> ", result);
            result.then(function(response) {
                    isSuccess = true;
                    license = response.data;
                },
                function(errorResponse) {
                    var message = "";
                    if (errorResponse.status === 417) {
                        message = "Aktivasi dengan internet gagal, harap periksa kembali koneksi internet anda";
                    } else if (errorResponse.status === 403) {
                        message = "Anda telah melewati batas aktivasi, harap lakukan aktivasi manual";
                    } else if (errorResponse.status === 503) {
                        message = "Tidak dapat melakukan koneksi dengan HELPDESK service, Anda harus terhubung dengan internet atau lakukan <a ng-click='gotoManual()'><b>Aktivasi Manual</b></a>";
                    }

                    $scope.open('Aktivasi Gagal', [message]).then(
                        function(close) {
                            $state.go("admin.licenseMgmt.create", {
                                paramUrl: "activation",
                                license: license
                            })
                        },
                        function(dismiss) {}
                    );
                }
            ).then(
                function() {
                    if (isSuccess) {
                        DialogFactory.showDialogMsg('Aktivasi Sukses', "serial number telah berhasil diaktifasi", "sm");
                        findAllLicense();
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
(function() {

    'use strict';
    angular.module('app').controller('ActiveUserController', ActiveUserController);

    ActiveUserController.$inject = ['$scope', '$filter', 'ngTableParams', '$stateParams', '$state', 'storageService', 'errorHandle', 'activeUserService']

    function ActiveUserController($scope, $filter, ngTableParams, $stateParams, $state, storageService, errorHandle, activeUserService) {

        var token = "";
        if (!storageService.isAuthorization("ADMIN")) {
            $state.go("checkroute");
        } else {
            token = storageService.getToken();
        }

        $scope.activeUser = "";
        $scope.activeUsers = [];
        $scope.showModal = false;

        $scope.toggleModal = function(activeUser) {
            $scope.activeUser = activeUser;
            DialogFactory.confDialogMsg('Konfirmasi Hapus Data', 'Apakah anda yakin untuk menghapus data?', 'md')
                .then(function(response) {
                    if (response) {
                        $scope.delete();
                    }
                }, function(dismiss) {});
        }

        /*
         *This Function used to fetch all teacher data
         */
        function fetchAllActiveUser() {
            $scope.activeUsers = [];
            var promise = activeUserService.fetchAllActiveUser(token);
            promise.then(
                function(response) {
                    $scope.activeUsers = response.data;
                    updateTableData($scope.activeUsers);
                },
                function(errorResponse) {
                    errorHandle.setError(errorResponse);
                }
            );
        };

        $scope.delete = function() {
            var promise = activeUserService.deleteActiveUser($scope.activeUser.id, token);
            promise.then(
                function(response) {
                    $scope.showModal = false;
                    fetchAllActiveUser();
                },
                function(errorResponse) {
                    errorHandle.setError(errorResponse);
                });
        };

        $scope.dataTable = new ngTableParams();

        /*$scope.
         * function to update ngTableParams in to show all class
         */
        function updateTableData(data_table) {
            $scope.dataTable = new ngTableParams({
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

        fetchAllActiveUser();
    }
})();
(function() {

    'use strict';
    angular
        .module('app')
        .controller('TeacherDashboardController', TeacherDashboardController);

    TeacherDashboardController.$inject = ['$scope', '$state', 'storageService', 'teacherService'];

    function TeacherDashboardController($scope, $state, storageService, teacherService) {
        /*
         * checking authorization
         */
        if (!storageService.isAuthorization("EMPLOYEE")) {
            $state.go("checkroute");
        } else {
            var user = storageService.getLoggedInUser();
            teacherService.findTeacher(user.nip, storageService.getToken());
        }

        $scope.dashboardRoute = function(params) {
            if (params == 'questionBank') {
                $state.go('teacher.questionBank');
            } else if (params == 'eventManagement') {
                $state.go('teacher.eventManagement');
            } else if (params == 'settings') {
                $state.go('teacher.accountSetting');
            } else if (params == 'chapter') {
                $state.go('teacher.chapter');
            }
        }
    }

})();
(function() {

    'use strict';
    angular
        .module('app')
        .controller('EventManagementController', EventManagementController);

    EventManagementController.$inject = ['$scope', '$filter', 'ngTableParams', '$stateParams', '$state', 'classService', 'subjectService', 'queastionBankService', 'eventService', 'teacherService', 'storageService', 'errorHandle', '$timeout', 'tinyMce', 'labelFactory', 'DialogFactory', '$sce', 'SortFactory'];

    function EventManagementController($scope, $filter, ngTableParams, $stateParams, $state, classService, subjectService, queastionBankService, eventService, teacherService, storageService, errorHandle, $timeout, tinyMce, labelFactory, DialogFactory, $sce, SortFactory) {

        $scope.currentTeacher;
        var token = " ";
        /*
         * checking authorization
         */
        if (!storageService.isAuthorization("EMPLOYEE")) {
            $state.go("checkroute");
        } else {
            $scope.currentTeacher = storageService.getLoggedInUser();
            token = storageService.getToken();
        }

        $scope.eventImgs = [{
            eventImgName: 'agama',
            label: 'Gambar 1'
        }, {
            eventImgName: 'bio',
            label: 'Gambar 2'
        }, {
            eventImgName: 'eco',
            label: 'Gambar 3'
        }, {
            eventImgName: 'eng',
            label: 'Gambar 4'
        }, {
            eventImgName: 'fisika',
            label: 'Gambar 5'
        }, {
            eventImgName: 'geo',
            label: 'Gambar 6'
        }, {
            eventImgName: 'ind',
            label: 'Gambar 7'
        }, {
            eventImgName: 'kimia',
            label: 'Gambar 8'
        }, {
            eventImgName: 'mat',
            label: 'Gambar 9'
        }, {
            eventImgName: 'sos',
            label: 'Gambar 10'
        }];



        $scope.eventStatusVal = 0;

        $scope.convertLabel = labelFactory.difficultyConverter;

        /*
         * Global / Scope variable
         * All Variable Declared in here first time
         */
        $scope.events = [];
        $scope.eventDetails = [];
        $scope.eventTable = new ngTableParams();
        $scope.questionTable = new ngTableParams();
        $scope.data = null;
        $scope.questionData = null;
        $scope.questionBySubjectList = null;
        $scope.showModal = false;
        $scope.isUpdate = false;
        $scope.selectedEvent = initEvent();
        $scope.eventResult = [];
        var self = this;
        self.tagFilter = null;
        $scope.subjectTagNames = [];
        $scope.ismeridian = false;
        $scope.eventQuestionWeight = [];
        $scope.totalWeight = 0;

        $scope.dateShow = {
            start: false,
            end: false,
        };

        $scope.handleDateShow = function(type, value) {
            if ($scope.isPrepared) {
                if (type === "start") {
                    $scope.dateShow.start = value
                } else {
                    $scope.dateShow.end = value
                }
            }
        };

        function initEvent() {
            var newDate = new Date();
            newDate.setSeconds(0);
            var selectedEvent = {
                eventName: "",
                eventType: "",
                classes: {},
                startDate: newDate,
                endDate: newDate,
                workingTime: "2",
                questionStructure: "RANDOM",
                questions: [],
                status: "PREPARED",
                empId: "",
                eventImgName: ""
            };
            return selectedEvent;
        }


        $scope.isPrepared = true;
        $scope.isCompleted = false;
        $scope.selectedQuestionList = null;

        $scope.subjectData = {
            availableOptions: [],
            selectedOption: undefined
        };

        $scope.classData = {
            availableOptions: [],
            selectedOption: {},
            isSelectAll: false
        };

        $scope.showImage = false;
        $scope.maxTime = 0;
        $scope.getTimeMinutes = function() {
            var mmStart = $scope.selectedEvent.startDate instanceof Date ? $scope.selectedEvent.startDate.getTime() : $scope.selectedEvent.startDate;
            var mmEnd = $scope.selectedEvent.endDate instanceof Date ? $scope.selectedEvent.endDate.getTime() : $scope.selectedEvent.endDate;
            if (mmEnd >= mmStart) {
                var deff = mmEnd - mmStart;
                $scope.maxTime = deff / 60000;
            } else {
                $scope.open("Tanggal & waktu tidak valid", ["waktu dimulai harus lebih kecil dari waktu berakhir"]);
            }
            return mmEnd >= mmStart;
        };
        $timeout(function() {
            $scope.$watch("selectedEvent.startDate", function(newValue, oldValue) {
                var isValid = $scope.getTimeMinutes();
                if (!isValid) {
                    $scope.selectedEvent.startDate = oldValue;
                }
            });

            $scope.$watch("selectedEvent.endDate", function(newValue, oldValue) {
                var isValid = $scope.getTimeMinutes();
                if (!isValid) {
                    $scope.selectedEvent.endDate = oldValue;
                }
            });
        }, 2000);

        $scope.trustAsHtml = tinyMce.trustAsHtml;

        $scope.image = function() {
            var result = "";
            if ($scope.selectedEvent.eventImgName !== "" && $scope.selectedEvent.eventImgName !== undefined) {
                result = 'images/thumbnail-tpl/' + $scope.selectedEvent.eventImgName + '_2.png';
                $scope.showImage = true;
            }
            return result;
        }

        /*
         * fetch all event
         */
        function getAllEvent() {
            var promise = eventService.fetchAllEvent(token, $scope.currentTeacher.nip);
            promise.then(
                function(response) {
                    $scope.events = response.data;
                },
                function(error) {
                    errorHandle.setError(error);
                }
            ).then(
                function() {
                    updateDataTable($scope.events);
                }
            );
        }

        /*
         * fetch all event
         */
        $scope.fetchEventResult = function() {
            $scope.eventResult = [];
            var cId = parseInt($scope.classData.selectedOption);
            var promise = eventService.fetchEventResult($stateParams.eventId, cId, token);
            promise.then(
                function(response) {
                    $scope.eventResult = [];
                    response.data.forEach(function(data) {
                        $scope.eventResult.push({
                            "KELAS": data.student.kelas.className,
                            "NIS": data.student.nis,
                            "NAMA SISWA": data.student.firstName + " " + data.student.lastName,
                            "JUMLAH BENAR": data.correct,
                            "JUMLAH SALAH": data.incorrect,
                            "NILAI": data.total
                        })
                    });

                },
                function(errorResponse) {
                    errorHandle.setError(errorResponse);
                });
        };

        /*
         * get event by id
         */
        function getEventById(eventId) {
            var promise = eventService.findEvent(eventId, token);
            promise.then(
                function(response) {
                    $scope.selectedEvent = response.data;
                    $scope.selectedEvent.startDate = new Date(response.data.startDate);
                    $scope.selectedEvent.endDate = new Date(response.data.endDate);
                    $scope.selectedEvent.workingTime = response.data.workingTime.toString();
                    $scope.getTimeMinutes();
                    if ($scope.selectedEvent.status === "PREPARED") {
                        $scope.isPrepared = true;
                        $scope.isCompleted = false;
                        $scope.eventStatusVal = 0;
                    } else if ($scope.selectedEvent.status === "PUBLISHED") {
                        $scope.isPrepared = false;
                        $scope.isCompleted = false;
                        $scope.eventStatusVal = 1;
                    } else if ($scope.selectedEvent.status === "RELEASED") {
                        $scope.isPrepared = false;
                        $scope.isCompleted = false;
                        $scope.eventStatusVal = 2;
                    } else if ($scope.selectedEvent.status === "COMPLETED") {
                        $scope.isPrepared = false;
                        $scope.isCompleted = true;
                        $scope.eventStatusVal = 3;
                    }
                },
                function(error) {
                    errorHandle.setError(error);
                });
        }

        /*
         * get class by event id
         */
        function getClassByEventId(eventId) {
            var promise = classService.fetchClassByEventId(eventId, token);
            promise.then(
                function(response) {
                    if ($state.is('teacher.eventManagement.result')) {
                        $scope.classData.availableOptions = response.data;
                    } else {
                        $scope.selectedEvent.classes = SortFactory.sortArr(response.data, "className", "asc");
                    }
                },
                function(error) {
                    errorHandle.setError(error);
                });
        }

        /*
         * get question by event id
         */
        function getQuestionByEventId(eventId) {
            var promise = queastionBankService.fetchQuestionByEventId(eventId, token);
            $scope.totalWeight = 0;
            promise.then(
                    function(response) {
                        var subject = response.data.QP[0].questionPool.subject;
                        $scope.subjectData.selectedOption = JSON.stringify(subject);
                        $scope.selectedEvent.questions = [];
                        response.data.questions.forEach(function(q) {
                            var question = {
                                id: q.id,
                                question: q.question,
                                difficulty: q.difficulty,
                                tagNames: q.tagNames
                            };
                            $scope.selectedEvent.questions.push(question);
                            $scope.eventQuestionWeight.push({ "question": question, "weight": q.weight })
                            $scope.totalWeight += q.weight;
                        });
                        $scope.fetchAllChapterByTeachIdAndSubjectId($scope.currentTeacher.id, subject.id);
                    },
                    function(error) {
                        errorHandle.setError(error);
                    })
                .then(
                    function() {
                        updateDataTable($scope.eventQuestionWeight);
                    }
                );
        }

        /*
         * fetch All question by SubjectID to filling reserved question in question bank
         */
        function getAllQuestionBySubject(subjectId) {
            var promise = queastionBankService.fetchAllQuestionBySubject(subjectId, token, $scope.currentTeacher.nip);
            promise.then(
                function(response) {
                    $scope.questionBySubjectList = [];
                    response.data.forEach(function(q) {
                        $scope.questionBySubjectList.push({
                            id: q.id,
                            question: q.question,
                            difficulty: q.difficulty,
                            tagNames: q.tagNames
                        });
                    });
                },
                function(errorResponse) {
                    $scope.questionBySubjectList = [];
                    errorHandle.setError(errorResponse);
                }
            ).then(
                function() {
                    self.tagFilter = undefined;
                    updateQuestionEventTable($scope.questionBySubjectList);
                }
            );
        }

        /*
         * fetch all subject to fill <select> options in create event
         */
        function getAllSubject() {
            var promise = subjectService.fetchAllSubject(token);
            promise.then(
                function(response) {
                    $scope.subjectData.availableOptions = response.data;
                },
                function(errorResponse) {
                    errorHandle.setError(errorResponse);
                }
            );
        };

        /*
         * fetch all Kelas to fill <select option in create event>
         */
        function getAllClass() {
            var promise = classService.fetchAllClass(token);
            promise.then(
                function(response) {
                    $scope.classData.availableOptions = [];
                    response.data.forEach(function(kelas) {
                        delete kelas.activated;
                        delete kelas.createdDate;
                        $scope.classData.availableOptions.push(kelas);
                    });
                },
                function(errorResponse) {
                    errorHandle.setError(errorResponse);
                }
            );
        };

        /*
         * this event active when check box "select all class isChecked or unChecked"
         */
        $scope.classChange = function() {
            $scope.selectedEvent.classes = [];
            if ($scope.classData.isSelectAll) {
                angular.forEach($scope.classData.availableOptions, function(data) {
                    $scope.selectedEvent.classes.push(data.id);
                });
            }
        };

        $scope.checkingClass = function() {
            if ($scope.selectedEvent.classes.length == $scope.classData.availableOptions.length && $scope.classData.availableOptions.length > 0) {
                $scope.classData.isSelectAll = true;
            } else {
                $scope.classData.isSelectAll = false;
            }
        }

        /*
         * this event active when button "choose question" in create event was clicked
         * then will update selected question table
         */
        $scope.uploadQuestion = function() {
            $scope.showModal = false;
            $scope.selectedEvent.questions.forEach(function(element) {
                $scope.eventQuestionWeight.push({ "question": element, "weight": 0 })
            });

            updateDataTable($scope.eventQuestionWeight);
        }

        /*
         * this function used for update table in HTML to presentation selected
         * question in create event
         */
        function updateDataTable(data_table) {
            $scope.eventTable = new ngTableParams({
                page: 1,
                count: 10
            }, {
                getData: function($defer, params) {
                    $scope.data = params.sorting() ? $filter('orderBy')(data_table,
                        params.orderBy()) : data_table;
                    $scope.data = params.filter() ? $filter('filter')($scope.data,
                        params.filter()) : $scope.data;
                    $scope.data = $scope.data.slice((params.page() - 1) *
                        params.count(),
                        params.page() * params.count());
                    $defer.resolve($scope.data);
                },
                total: data_table.length
            });
        };

        /*
         * this function used for update table in HTML to presentating
         * reserved question in question bank
         */
        function updateQuestionEventTable(data_table) {
            console.log("Data : " + data_table);
            $scope.questionTable = new ngTableParams({
                page: 1,
                count: 10
            }, {
                getData: function($defer, params) {
                    $scope.questionData = params.sorting() ? $filter('orderBy')(data_table,
                        params.orderBy()) : data_table;
                    $scope.questionData = params.filter() ? $filter('filter')($scope.questionData,
                        params.filter()) : $scope.questionData;
                    $scope.questionData = $scope.questionData.slice((params.page() - 1) *
                        params.count(),
                        params.page() * params.count());
                    $defer.resolve($scope.questionData);
                },
                total: data_table.length
            });

        };

        /*
         *This Function used save or update
         *SAVING when $scope.isUpdate equal false
         *and UPDATING when $scope.isUpdate equal true
         */
        $scope.saveOrUpdate = function() {
            var promise = null;
            var questionsID = [];
            var events = $scope.selectedEvent;

            if ($scope.selectedEvent.classes !== undefined) {
                var temArr = []
                $scope.selectedEvent.classes.forEach(function(kelas) {
                    temArr.push(kelas.id);
                });
                events.classes = [].concat(temArr);
            }
            events.empId = $scope.currentTeacher.id;
            angular.forEach($scope.eventQuestionWeight, function(data) {
                if (data !== undefined) {
                    questionsID.push({ "id": data.question.id, "weight": data.weight });
                }
            });
            events.questions = questionsID;
            var locale = 'id-ID';

            if ($scope.selectedEvent.startDate instanceof Date) {
                events.startDate = $scope.selectedEvent.startDate.getTime();
            } else {
                events.startDate = $scope.selectedEvent.startDate;
            }

            if ($scope.selectedEvent.endDate instanceof Date) {
                events.endDate = $scope.selectedEvent.endDate.getTime();
            } else {
                events.endDate = $scope.selectedEvent.endDate;
            }
            var validData = false;
            var invalidMsg = [];
            // check class data is not empty
            if (events.classes && events.classes.length > 0) {
                validData = true;
            } else {
                validData = false;
                invalidMsg.push("kelas belum di pilih");
            }

            if (events.questions && events.questions.length > 0) {
                validData = true;
            } else {
                validData = false;
                invalidMsg.push("soal-soal belum di tambahkan")
            }

            if (validData) {
                if ($scope.isUpdate) {
                    promise = eventService.updateEvent(events, token);
                    promise.then(
                        function(response) {
                            $state.go('teacher.eventManagement');
                        },
                        function(errorResponse) {
                            errorHandle.setError(errorResponse);
                        }
                    );

                } else {
                    promise = eventService.saveEvent(events, token);
                    promise.then(
                        function(response) {
                            $state.go('teacher.eventManagement');
                        },
                        function(errorResponse) {
                            errorHandle.setError(errorResponse);
                            if (errorResponse.status === 403) {
                                DialogFactory.showDialogMsg('Tambah Ujian Gagal',
                                    'Tambah Ujian hanya dapat dibuat satu kali', 'md');
                            }
                        }
                    );
                }
            } else {
                //error here please
                $scope.open("Data tidak valid", invalidMsg);
            }
        };

        /*
         * toogle modal in teacher event mgmt to show delete confirmation dialog
         */
        $scope.toggleModal = function(event_data) {
            $scope.showModal = !$scope.showModal;
            $scope.selectedEvent = event_data;
        };

        function initCreateEventPage() {
            getAllSubject();
            getAllClass();
        }

        /*
         * toogle modal in teacher create event to show reserved question
         */
        $scope.toggleModalQuestion = function() {
            if ($scope.subjectData.selectedOption != null && $scope.subjectData.selectedOption != undefined) {
                $scope.showModal = !$scope.showModal;
                var subject = JSON.parse($scope.subjectData.selectedOption);
                getAllQuestionBySubject(subject.id);
            } else {
                $scope.open("Bank soal belum dipilih", ["silahkan pilih bank soal terlebih dahulu!"]);
            }
        }

        $scope.open = DialogFactory.showErrorMsg;

        // Adding Clear List question when subject change
        $scope.subjectChange = function() {
            $scope.selectedEvent.questions = [];
            $scope.questionBySubjectList = [];
            updateDataTable($scope.selectedEvent.questions);
            var subject = JSON.parse($scope.subjectData.selectedOption);
            $scope.fetchAllChapterByTeachIdAndSubjectId($scope.currentTeacher.id, subject.id);
        };

        // Fetching TagNames by Teacher ID and Subject ID for serving tag names
        // Params is teacherId, subjectId
        $scope.fetchAllChapterByTeachIdAndSubjectId = function(teacherId, subjectId) {
            subjectService.fetchAllChapterByTeachIdAndSubjectId(teacherId, token, subjectId)
                .then(
                    function(response) {
                        $scope.subjectTagNames = response.data;
                    },
                    function(errorResponse) {
                        $scope.subjectTagNames = [];
                        console.log(errorResponse);
                    }
                );
        }

        // Convert TagNames
        $scope.convertTagNames = function(question) {
            var stringBuilder = "";
            question.tagNames.forEach(function(tag) {
                stringBuilder = stringBuilder.concat('<label class="label label-primary">' + tag.tagName + '</label>');
            });
            return $sce.trustAsHtml(stringBuilder);
        }

        // Filter Question By TagNames
        $scope.filterQuestionByTagnames = function(tags) {
            if (tags) {
                var tagIds = [];
                tags.forEach(function(tag) {
                    tagIds.push(tag.id);
                });
                queastionBankService.filterQuestionByTagNames(token, tagIds).then(
                    function(response) {
                        $scope.questionBySubjectList = [];
                        response.data.forEach(function(q) {
                            $scope.questionBySubjectList.push({
                                id: q.id,
                                question: q.question,
                                difficulty: q.difficulty,
                                tagNames: q.tagNames
                            });
                        });
                    },
                    function(errorResponse) {
                        $scope.questionBySubjectList = [];
                        errorHandle.setError(errorResponse);
                    }
                ).then(
                    function() {
                        self.tagFilter = undefined;
                        updateQuestionEventTable($scope.questionBySubjectList);
                    }
                );

            }

        };

        $scope.publishOrUnPublish = function(param) {
            $scope.selectedEvent.status = param;
            $scope.isPrepared = !$scope.isPrepared;
            if (param === "PUBLISHED") {
                $scope.saveOrUpdate();
            }
        };

        $scope.isPublishVisible = function() {
            if ($scope.selectedEvent.status === "PREPARED" && $scope.isUpdate) {
                return true;
            } else {
                return false;
            }
        };

        $scope.isUnPublishVisible = function() {
            if ($scope.selectedEvent.status !== "PREPARED" && $scope.isUpdate) {
                return true;
            } else {
                return false;
            }
        };

        $scope.isUnPublishDisable = function() {
            if ($scope.selectedEvent.status === "RELEASED") {
                return true;
            } else {
                return false;
            }
        };

        // for handling change in checklist model
        $scope.checklistHandle = function(question) {
            var index = $scope.selectedEvent.questions.findIndex(function(q) {
                return q.id === question.id;
            });

            if (index == -1) {
                $scope.selectedEvent.questions.push(question);
            } else {
                $scope.selectedEvent.questions.splice(index, 1);
            }
        }

        // calculate weight
        $scope.calculateWeight = function() {
            $scope.totalWeight = 0;
            $scope.eventQuestionWeight.forEach(function(element) {
                $scope.totalWeight += parseInt(element.weight);
            });
        }

        // Correction Handle
        $scope.eventStudents = [];
        $scope.isAllCorrected = false;

        function fetchEventStudents() {
            eventService.fetchEventStudents(token, $stateParams.eventId).then(
                function(success) {
                    $scope.eventStudents = success.data;
                    var correctionCount = 0;
                    success.data.forEach(function(el) {
                        if (el.correctionStatus) {
                            correctionCount++;
                        }
                    });
                    if (correctionCount === success.data.length) {
                        $scope.isAllCorrected = true;
                    }
                },
                function(error) {
                    console.log(error);
                }
            );
        }
        // correction student exam
        $scope.detailStudentExamine;
        $scope.essayIsOpen = false;
        $scope.essayIsDisabled = false;
        $scope.mcIsOpen = false;

        function fetchDetailStudentExamine() {
            eventService.fetchDetailStudentExamine(token, $stateParams.eventId, $stateParams.studentNis).then(
                function(response) {
                    $scope.detailStudentExamine = response.data;
                    $scope.essayIsOpen = $scope.detailStudentExamine.listEssay.length > 0;
                    $scope.essayIsDisabled = !$scope.essayIsOpen;
                    $scope.mcIsOpen = $scope.essayIsOpen ? false : true;

                },
                function(error) {
                    console.log(error);
                }
            );
        }

        $scope.saveEventResult = function() {
            eventService.saveEventResult(token, $stateParams.eventId, $stateParams.studentNis, $scope.detailStudentExamine.listEssay).then(
                function(response) {
                    $state.go("^");
                },
                function(error) {
                    console.log(error);
                }

            );
        }


        if ($state.is('teacher.eventManagement')) {
            if ($scope.currentTeacher != null) {
                getAllEvent();
            }
        } else if ($state.is('teacher.eventManagement.create')) {
            $scope.isUpdate = false;
            initCreateEventPage();
        } else if ($state.is('teacher.eventManagement.update')) {
            initCreateEventPage();
            $scope.isUpdate = true;
            if ($stateParams.eventId != null && $stateParams.eventId != undefined && $stateParams.eventId != "") {
                getEventById($stateParams.eventId);
                getQuestionByEventId($stateParams.eventId);
                $timeout(function() {
                    getClassByEventId($stateParams.eventId);
                }, 500)
            }
        } else if ($state.is('teacher.eventManagement.result')) {
            if ($stateParams.eventId != null && $stateParams.eventId != undefined && $stateParams.eventId != "") {
                getEventById($stateParams.eventId);
                $timeout(function() {
                    getClassByEventId($stateParams.eventId);
                }, 500)

                $scope.exportDataToXlsx = function() {
                    DialogFactory.exportDataToXlsx($scope.eventResult, $scope.selectedEvent.eventName);
                }
            }
        } else if ($state.is('teacher.eventManagement.correction')) {
            fetchEventStudents();
            getEventById($stateParams.eventId);
        } else if ($state.is('teacher.eventManagement.correction.studentResult')) {
            fetchDetailStudentExamine();
            $scope.oneAtATime = false;


        }
    }

})();
(function() {

    'use strict';
    angular.module('app').controller('QuestionsBankController', QuestionsBankController);

    QuestionsBankController.$inject = ['$scope', '$filter', 'ngTableParams', '$stateParams', '$state', 'queastionBankService', 'subjectService', 'teacherService', 'storageService', 'errorHandle', '$timeout', 'tinyMce', 'DialogFactory'];

    function QuestionsBankController($scope, $filter, ngTableParams, $stateParams, $state, queastionBankService, subjectService, teacherService, storageService, errorHandle, $timeout, tinyMce, DialogFactory) {

        $scope.currentTeacher;
        var token = " ";

        /*
         * checking authorization
         */
        if (!storageService.isAuthorization("EMPLOYEE")) {
            $state.go("checkroute");
        } else {
            $scope.currentTeacher = storageService.getLoggedInUser();
            token = storageService.getToken();
        }

        /*
         * Global / Scope variable
         * All Variable Declared in here first time
         */
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

        $scope.questionBankTable = new ngTableParams();
        $scope.data = [];
        $scope.questionBanks = [];
        $scope.subjectData = {
            availableOptions: [],
            selectedOption: {}
        };
        $scope.updateQP = false;
        $scope.selectedTeacher = null;
        $scope.selectedQuestionBank = {
            "questionPoolName": "",
            'subject': {},
            'questions': [],
            'teacherId': $scope.currentTeacher.id
        };
        $scope.showModal = false;
        $scope.selectedQuestion = {};
        $scope.isUpdateQuestion = false;
        $scope.selectedQuestionGroup;


        $scope.getQGType = function(qgType) {
            if (qgType === "MC") {
                return "Soal Tunggal - Pilihan Ganda";
            } else if (qgType === "TF") {
                return "Soal Tunggal - Benar Salah";
            } else if (qgType === "PASSAGE") {
                return "Soal Wacana";
            } else if (qgType === "ESSAY") {
                return "Soal Tunggal - Essay"
            }
        };


        /*
         * Fetch All Question Bank
         */
        function findAllQuestionBank() {
            var promise = queastionBankService.fetchAllQuestionBank(token, $scope.currentTeacher.nip);
            promise.then(
                function(response) {
                    $scope.questionBanks = response.data;
                },
                function(errorResponse) {
                    errorHandle.setError(errorResponse);
                }
            ).then(
                function() {
                    updateDataTable($scope.questionBanks);
                });
        };

        /*
         * fetching all question by QuestionPoolId to showing detail of Question Pool
         */
        function fetchAllQuestion(id) {
            var promise = queastionBankService.fetchAllQuestion(id, token);
            promise.then(
                function(response) {
                    updateDataTable(response.data);
                },
                function(errorResponse) {
                    errorHandle.setError(errorResponse);
                });
        }

        $scope.trustAsHtml = tinyMce.trustAsHtml;

        /*
         * fetching all question by QuestionPoolId to showing detail of Question Pool
         */
        function detailQuestionPool(id) {
            var promise = queastionBankService.detailQuestionPool(id, token, $scope.currentTeacher.nip);
            promise.then(
                    function(response) {
                        $scope.questionBanks = response.data;
                    },
                    function(errorResponse) {
                        errorHandle.setError(errorResponse);
                    })
                .then(function() {
                    updateDataTable($scope.questionBanks);
                });
        }

        /*
         * find Question Pool by Question Pool Id to show detail of question pool
         */
        function findQuestionBank(id) {
            var promise = queastionBankService.findQuestionBank(id, token);
            promise.then(
                function(response) {
                    $scope.selectedQuestionBank = response.data;
                    $scope.selectedQuestionBank.subject.id = $scope.selectedQuestionBank.subject.id.toString();
                },
                function(errorResponse) {
                    errorHandle.setError(errorResponse);
                }
            );
        };


        /*
         * get All subject to filling <select> option when importing question in Question Pool Event
         */
        function findAllSubject() {
            subjectService.fetchAllSubject(token).then(
                function(response) {
                    $scope.subjectData.availableOptions = response.data;
                },
                function(errorResponse) {
                    errorHandle.setError(errorResponse);
                }
            );
        };

        /*
         * used for editng selectedQuestion by Question ID
         */
        function findQuestion(id) {
            var promise = queastionBankService.findQuestion(id, token);
            promise.then(
                function(response) {
                    $scope.selectedQuestion = response.data;
                },
                function(errorResponse) {
                    errorHandle.setError(errorResponse);
                }

            );
        };

        /*
         * Import All Question Bank
         */
        $scope.importQuestionBank = function() {
            var promise = queastionBankService.importQuestionBankTemp($scope.selectedQuestionBank, token);
            promise.then(
                function(response) {
                    $state.go('teacher.questionBank');
                },
                function(errorResponse) {
                    errorHandle.setError(errResponse);
                }
            );
        };

        /*
         * used for showing question Pool data
         */
        function updateDataTable(data_table) {
            $scope.questionBankTable = new ngTableParams({
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
        };

        /*
         * used for showing delete confirmation selectedQuestionBank
         */
        $scope.toggleModal = function(questionBank) {
            $scope.selectedQuestionBank = questionBank;
            DialogFactory.confDialogMsg('Konfirmasi Hapus Data', 'Apakah anda yakin untuk menghapus bank soal?', 'md')
                .then(function(response) {
                    if (response) {
                        $scope.deleteQuestionBank();
                    }
                }, function(dismiss) {});
        };

        /*
         * used for showing delete confirmation selectedQuestion
         */
        $scope.toggleModalQuestion = function(question) {
            $scope.showModal = !$scope.showModal;
            $scope.selectedQuestion = question;
        };

        $scope.toggleModalQuestionGroup = function(qGroup) {
            $scope.selectedQuestionGroup = qGroup;
            DialogFactory.confDialogMsg('Konfirmasi Hapus Data', 'Apakah anda yakin untuk menghapus soal?', 'md')
                .then(function(response) {
                    if (response) {
                        $scope.deleteQuestionGroup();
                    }
                }, function(dismiss) {});
        };

        $scope.showQuestionTypeOption = function() {
            DialogFactory.showQuestionTypeOption("questionBankDetail").then(
                function(response) {
                    $state.go('teacher.questionBank.qpdetail.qCreateOrUpdate', {
                        "qType": response,
                        "subjectId": $scope.selectedQuestionBank.subject.id
                    });
                },
                function(dismiss) {});
        };

        $scope.deleteQuestionGroup = function() {
            var id = $scope.selectedQuestionGroup.id;
            queastionBankService.deleteQuestionGroup(id, token)
                .then(function(response) {
                    $scope.data.splice($scope.data.findIndex(group => group.id === id), 1);
                    $scope.questionBanks.splice($scope.questionBanks.findIndex(group => group.id === id), 1);
                    $scope.showModal = false;
                }, function(errorResponse) {
                    errorHandle.setError(errResponse);
                });
        }

        /*
         * used for showing delete confirmation selectedQuestion
         */
        $scope.editQstGroup = function(qGroup) {
            $state.go('teacher.questionBank.qpdetail.qCreateOrUpdate', {
                "qType": qGroup.qgType,
                "qId": qGroup.id
            });
        };

        /*
         *This Function used save or update
         *SAVING when $scope.isUpdate equal false
         *and UPDATING when $scope.isUpdate equal true
         */
        $scope.saveOrUpdate = function() {
            var promise = null;
            if ($scope.isUpdateQuestion) {
                $scope.selectedQuestion.questionPool = {};
                promise = queastionBankService.updateQuestion($scope.selectedQuestion, token);
                promise.then(
                    function(response) {
                        $state.go('teacher.questionBank.qpdetail');
                    },
                    function(errorResponse) {
                        errorHandle.setError(errorResponse);
                    }
                );
            }
        };

        /*
         * used for delete selected Question by questionID
         */
        $scope.deleteQuestion = function() {
            var promise = queastionBankService.deleteQuestion($scope.selectedQuestion.id, token);
            promise.then(
                function(response) {
                    $scope.showModal = false;
                    fetchAllQuestion($scope.selectedQuestionBank.id);
                },
                function(errorResponse) {
                    errorHandle.setError(errorResponse);
                }
            );
        };

        /*
         * used for delete selected Question Pool
         */
        $scope.deleteQuestionBank = function() {
            var promise = queastionBankService.deleteQuestionBank($scope.selectedQuestionBank.id, token);
            promise.then(
                function(response) {
                    $scope.showModal = false;
                    findAllQuestionBank();
                },
                function(errorResponse) {
                    errorHandle.setError(errorResponse);
                }
            );
        };

        /*
         * used for create Question Pool
         */
        $scope.createQuestionPool = function() {
            var promise;
            if ($scope.updateQP) {
                promise = queastionBankService.updateQuestionBank($scope.selectedQuestionBank, token);
            } else {
                promise = queastionBankService.createQuestionPool(token, $scope.selectedQuestionBank);
            }
            promise.then(
                function(response) {
                    $state.go("^");
                },
                function(errorResponse) {
                    errorHandle.setError(errorResponse);
                    if (errorResponse.status === 403) {
                        DialogFactory.showDialogMsg('Tambah Bank Soal Gagal',
                            'Bank Soal hanya dapat dibuat sebanyak lima kali', 'md');
                    }
                }
            );
        };

        if ($state.is('teacher.questionBank')) {
            if ($scope.currentTeacher != null) {
                findAllQuestionBank();
            }

        } else if ($state.is('teacher.questionBank.import')) {
            findAllSubject();
            $scope.download = function(resource) {
                window.open(resource);
            }

            $scope.updateData = function() {
                $scope.data = $scope.csv.result;
                $scope.selectedQuestionBank.subjectId = $scope.subjectData.selectedOption.id;
                $scope.selectedQuestionBank.questions = $scope.csv.result;
                $scope.selectedQuestionBank.teacherId = $scope.currentTeacher.id;
                updateDataTable($scope.csv.result);
            }

        } else if ($state.is('teacher.questionBank.qpdetail.qdetail')) {
            if ($stateParams.questionId != undefined && $stateParams.questionId != null && $stateParams.questionId != "") {
                findQuestion($stateParams.questionId);
                $scope.isUpdateQuestion = true;
            } else {
                $scope.isUpdateQuestion = false;
            }
        } else if ($state.is('teacher.questionBank.qpdetail')) {
            if ($stateParams.questionBankId != undefined && $stateParams.questionBankId != null && $stateParams.questionBankId != "") {
                detailQuestionPool($stateParams.questionBankId);
                findQuestionBank($stateParams.questionBankId);
            }
        } else if ($state.is('teacher.questionBank.create')) {
            if ($stateParams.questionBankId != undefined && $stateParams.questionBankId != null && $stateParams.questionBankId != "") {
                findQuestionBank($stateParams.questionBankId);
                $scope.updateQP = true;
            } else {
                $scope.updateQP = false;
                findAllSubject();
            }

        }
    }

})();
(function() {

    'use strict';
    angular
        .module('app')
        .controller('QuestionController', QuestionController);

    QuestionController.$inject = ['$scope', '$filter', 'ngTableParams', '$stateParams', '$state', 'storageService', '$http', 'tinyMce', 'subjectService', 'queastionBankService', 'errorHandle', '$sce', 'DialogFactory', '$timeout', 'bsLoadingOverlayService'];

    function QuestionController($scope, $filter, ngTableParams, $stateParams, $state, storageService, $http, tinyMce, subjectService, queastionBankService, errorHandle, $sce, DialogFactory, $timeout, bsLoadingOverlayService) {

        var token = "";
        var type = $stateParams.qType;
        $scope.currentTeacher;
        $scope.title;
        $scope.showAddQst = false;
        $scope.questionUpdate = false;
        $scope.tinymceQuestion = tinyMce.config(200);
        $scope.tinymceOptions = tinyMce.config(100);
        $scope.tinymceExplanation = tinyMce.config(200);
        $scope.isUpdatePassageQ = false;
        $scope.isUpdateMCOption = false;
        $scope.editIndexQuestion = 0;
        $scope.editIndexOption = 0;
        $scope.showModal = false;
        $scope.qPassageType = "";
        $scope.passageQuestions = [];
        $scope.optionModel = "";
        $scope.selectedQuestion = initQst();
        $scope.showModal = false;
        $scope.showModalPassage = false;
        $scope.file;
        $scope.image;
        $scope.imageGalery = [];
        $scope.trustAsHtml = tinyMce.trustAsHtml;
        $scope.images = [];
        $scope.questionGroup;

        if (!storageService.isAuthorization("EMPLOYEE")) {
            $state.go("checkroute");
        } else {
            $scope.currentTeacher = storageService.getLoggedInUser();
            token = storageService.getToken();
        }

        $scope.showEditor = {
            question: false,
            option: false,
            explanation: false,
            panel: false,
            globalValue: false,
            optionA: false,
            optionB: false,
            optionC: false,
            optionD: false,
            optionE: false,
        };

        $scope.qstOptions = initOptionQst("MC");

        function initOptionQst(typeQ) {
            if (typeQ == "TF") {
                return [{
                    'index': 'true',
                    'name': 'Benar'
                }, {
                    'index': 'false',
                    'name': 'Salah'
                }]
            } else {
                return [{
                    'index': "A",
                    'name': 'A'
                }, {
                    'index': "B",
                    'name': 'B'
                }, {
                    'index': "C",
                    'name': 'C'
                }, {
                    'index': "D",
                    'name': 'D'
                }, {
                    'index': "E",
                    'name': 'E'
                }];
            }
        };

        /*
         * used for fill default selectedQuestion value
         */
        function initQst() {
            return {
                'tagNames': [],
                'id': null,
                'question': "",
                'difficulty': null,
                'key': null,
                'explanation': null,
                'optionA': null,
                'optionB': null,
                'optionC': null,
                'optionD': null,
                'optionE': null,
                'typeQuestion': null
            };
        };

        if (type != null) {
            $scope.questionType = type;
            if (type === "MC") {
                $scope.title = "Pilihan Ganda";
                $scope.selectedQuestion.typeQuestion = "MC";
            } else if (type === "TF") {
                $scope.title = "Benar Salah";
                $scope.selectedQuestion.typeQuestion = "TF";
            } else if (type === "MTCH") {
                $scope.title = "Mencocokkan";
            } else if (type === "PASSAGE") {
                $scope.title = "Wacana";
            } else if (type === "ESSAY") {
                $scope.title = "Essay";
            }
        };

        $scope.tags = {
            'availableOption': [],
            'showTag': true
        };

        $scope.questionGroup = {
            qgType: type,
            globalValue: null,
            questionPoolId: $stateParams.questionBankId,
            questions: []
        }

        // upload images
        $scope.uploadImages = function(questionGroupId) {
            if ($scope.images.length > 0) {
                queastionBankService.uploadImages(token, questionGroupId, $scope.images);
            }
        };

        // open insert images 
        $scope.showImagesPanel = function(tinymceModel) {
            var element = document.querySelectorAll('[ng-model="' + tinymceModel + '"]')[0];

            DialogFactory.openImagesGallery($scope.images, token).then(
                function(response) {
                    $scope.images = response.images;
                    var ed = tinyMCE.get(element.id);
                    var image = ed.getDoc().createElement("img")
                    image.src = response.selectedImage.base64;
                    image.style.cssText = "height:auto; width:250px; max-width:700px;"
                    ed.execCommand('mceInsertContent', false, image.outerHTML);
                },
                function(dismiss) {
                    $scope.images = response.images;
                }
            );
        };



        function findAllGallery() {
            var promise = queastionBankService.findAllGallery(token, $scope.currentTeacher.nip);
            promise.then(function(response) {
                $scope.imageGalery = [];
                angular.forEach(response.data, function(data) {
                    var pathFile = data.pathFile.split('webapps')[1];
                    if (pathFile.indexOf("\\") != (-1)) {
                        pathFile = pathFile.split("\\").join("/");
                    }
                    //var basePath = baseUrl.getUrl().split('/cbt-backend')[0];
                    pathFile = ".." + pathFile;
                    //pathFile = $sce.trustAsResourceUrl(pathFile);
                    $scope.imageGalery.push(pathFile);
                });
            }, function(errorResponse) {
                errorHandle.setError(errorResponse);
            });
        };

        /*
         * Passage Question Add
         */
        $scope.passageQuestionAdd = function(passageQuestion) {
            var result = validatingNormalQuestion(passageQuestion, 0);
            if (result.isValid) {
                if (!$scope.isUpdatePassageQ) {
                    $scope.passageQuestions.push(passageQuestion);
                } else {
                    $scope.passageQuestions[$scope.editIndexQuestion] = passageQuestion;
                    $scope.isUpdatePassageQ = false;
                }
                $scope.selectedQuestion = initQst();
                $scope.qstOptions = [];
                $scope.showAddQst = false;
            } else {
                DialogFactory.showDialogMsg('Gagal Simpan', result.message, 'md')
            }

        };

        /*
         * Passage Question remove
         */
        $scope.passageQuestionRemove = function(index) {
            $scope.passageQuestions.splice(index, 1);
        };

        /*
         * Passage Question edit
         */
        $scope.passageQuestionEdit = function(question, index) {
            findAll().then(function() {
                $scope.isUpdatePassageQ = true;
                $scope.selectedQuestion = question;
                $scope.showAddQst = true;
                $scope.qPassageType = question.typeQuestion;
                $scope.editIndexQuestion = index;
                if (question.typeQuestion == 'MC') {
                    $scope.qstOptions = initOptionQst("MC");
                } else if (question.typeQuestion == 'TF') {
                    $scope.qstOptions = initOptionQst("TF");
                }
                if ($scope.tags.availableOption.length > 0 && $scope.selectedQuestion.tagNames.length > 0) {
                    for (var i = 0; i < $scope.selectedQuestion.tagNames.length; i++) {
                        var data = $scope.selectedQuestion.tagNames[i];
                        $scope.tags.availableOption.splice($scope.tags.availableOption.findIndex(d => d.tagName === data.tagName), 1);
                        console.log("available option" + $scope.tags.availableOption.length);
                    };
                }
            });
        };

        /*
         *fetch all tags in current teacher
         */
        function findAll() {
            var promise = subjectService.fetchAllChapterByTeachIdAndSubjectId($scope.currentTeacher.id, token, $stateParams.subjectId);
            promise.then(
                function(response) {
                    $scope.tags.availableOption = [];
                    angular.forEach(response.data, function(data) {
                        $scope.tags.availableOption.push({
                            'id': data.id,
                            'tagName': data.tagName
                        })
                    });
                },
                function(errorResponse) {
                    errorHandle.setError(errorResponse);
                });

            return promise;
        };

        /*
         * fetch all question from qstGroup and show detail qstGroup
         */
        function findQuestionGroupDetail() {
            bsLoadingOverlayService.start({
                referenceId: 'loading'
            });
            var promise = queastionBankService.detailQuestionGroup($stateParams.qId, token);
            promise.then(
                function(response) {
                    $scope.questionGroup = response.data.questionGroup[0];
                    $scope.images = response.data.images;
                    if (type == "PASSAGE") {
                        $scope.passageQuestions = $scope.questionGroup.questions;
                    } else {
                        $scope.selectedQuestion = $scope.questionGroup.questions[0];
                        if ($scope.tags.availableOption.length > 0 && $scope.selectedQuestion.tagNames.length > 0) {
                            for (var i = 0; i < $scope.selectedQuestion.tagNames.length; i++) {
                                var data = $scope.selectedQuestion.tagNames[i];
                                $scope.tags.availableOption.splice($scope.tags.availableOption.findIndex(d => d.tagName === data.tagName), 1);
                            };
                        }
                        if (type == "MC") {
                            $scope.qstOptions = initOptionQst("MC");
                        }
                    }
                    $timeout(function() {
                        bsLoadingOverlayService.stop({
                            referenceId: 'loading'
                        });
                    }, 1500);
                },
                function(errorResponse) {
                    bsLoadingOverlayService.stop({
                        referenceId: 'loading'
                    });
                    errorHandle.setError(errorResponse);
                });
        };

        $scope.showPanel = function(value, value_2) {
            findAll();
            $scope.selectedQuestion = initQst();
            $scope.selectedQuestion.typeQuestion = value_2;
            $scope.qPassageType = value_2;

            if (value_2 == 'MC') {
                $scope.qstOptions = initOptionQst("MC")
            } else if (value_2 == 'TF') {
                $scope.qstOptions = initOptionQst("TF")
            }

            $scope.showAddQst = value;
            $scope.showModalPassage = false;

        }

        $scope.showQuestionTypeOption = function() {
            DialogFactory.showQuestionTypeOption("").then(
                function(response) {
                    findAll();
                    $scope.selectedQuestion = initQst();
                    $scope.selectedQuestion.typeQuestion = response;
                    $scope.qPassageType = response;

                    if (response == 'MC') {
                        $scope.qstOptions = initOptionQst("MC")
                    } else if (response == 'TF') {
                        $scope.qstOptions = initOptionQst("TF")
                    }

                    $scope.showAddQst = true;
                },
                function(dismiss) {});
        };

        $scope.addTag = function(tagStr) {
            if (tagStr != '') {
                var tag = JSON.parse(tagStr);
                $scope.selectedQuestion.tagNames.push(tag);
                $scope.tags.availableOption.splice($scope.tags.availableOption.findIndex(t => t.tagName === tag.tagName), 1);
            }
            $scope.tags.showTag = true;
        };

        $scope.deleteTag = function(index) {
            $scope.tags.availableOption.push($scope.selectedQuestion.tagNames[index]);
            $scope.selectedQuestion.tagNames.splice(index, 1);
        };

        // Saving Question 
        $scope.saveQuestion = function() {
            var result = {};
            if (type === "PASSAGE") {
                $scope.questionGroup.questions = $scope.passageQuestions;
                result = validatingPassageQuestion($scope.questionGroup);

            } else {
                result = validatingNormalQuestion($scope.selectedQuestion, 0);
                if (result.isValid) {
                    if ($scope.questionUpdate) {
                        $scope.questionGroup.questions[0] = $scope.selectedQuestion;
                    } else {
                        $scope.questionGroup.questions.push($scope.selectedQuestion);
                    }
                }

            }

            bsLoadingOverlayService.start({
                referenceId: 'loading'
            });
            if (result.isValid) {
                if ($scope.questionUpdate) {
                    var promise = queastionBankService.updateQuestionGroup(token, $scope.questionGroup);
                    promise.then(function(response) {
                        $scope.uploadImages($stateParams.qId);
                        $timeout(function() {
                            bsLoadingOverlayService.stop({
                                referenceId: 'loading'
                            });
                            $state.go("^");
                        }, 2000);
                    }, function(errorResponse) {
                        bsLoadingOverlayService.stop({
                            referenceId: 'loading'
                        });
                        errorHandle.setError(errorResponse);
                    });
                } else {
                    var promise = queastionBankService.createQuestionGroup(token, $scope.questionGroup);
                    promise.then(function(response) {
                        $scope.uploadImages(response.data.id);
                        $timeout(function() {
                            bsLoadingOverlayService.stop({
                                referenceId: 'loading'
                            });
                            $state.go("^");
                        }, 2000);
                    }, function(errorResponse) {
                        bsLoadingOverlayService.stop({
                            referenceId: 'loading'
                        });
                        errorHandle.setError(errorResponse);
                    });
                }
            } else {
                bsLoadingOverlayService.stop({
                    referenceId: 'loading'
                });
                DialogFactory.showDialogMsg('Gagal Simpan', result.message, 'md');
            }


        };

        //form validating for create or updating passage question 
        function validatingPassageQuestion(group) {
            var messageBuilder = "<p style='text-align:left; font-size:10pt;'>";
            var errorCounter = 0;
            var QCheckAble = true;
            var elementId = document.querySelectorAll('[ng-model="questionGroup.globalValue"]')[0].id;
            var element = tinyMCE.get(elementId).getContent();
            var isValid = true;
            if (!element) {
                errorCounter++;
                messageBuilder = messageBuilder.concat(errorCounter + " . Wacana tidak boleh kosong <br/>");
                isValid = false;
            }
            if (group.questions.length === 0) {
                errorCounter++;
                messageBuilder = messageBuilder.concat(errorCounter + " . Daftar Soal tidak boleh kosong, minimal ada 1 soal. <br/>");
                QCheckAble = false;
                isValid = false;
            }
            messageBuilder = messageBuilder.concat('</p>');
            return {
                isValid: isValid,
                message: messageBuilder
            };
        }

        function validatingNormalQuestion(q, ec) {
            var messageBuilder = "<p style='text-align:left; font-size:10pt;'>";
            var isValid = true;

            if (q.tagNames.length === 0) {
                ec++;
                messageBuilder = messageBuilder.concat(ec + " . Sub Materi tidak boleh kosong <br/>");
                isValid = false;
            }

            if (!q.question) {
                ec++;
                messageBuilder = messageBuilder.concat(ec + " . Pertanyaan tidak boleh kosong <br/>");
                isValid = false;
            }

            if (!q.key && (q.typeQuestion === "MC" || q.typeQuestion === "TF")) {
                ec++;
                messageBuilder = messageBuilder.concat(ec + " . Kunci Jawab tidak boleh kosong <br/>");
                isValid = false;
            }

            if (!q.explanation) {
                ec++;
                messageBuilder = messageBuilder.concat(ec + " . Pembahasan tidak boleh kosong <br/>");
                isValid = false;
            }

            if (q.typeQuestion === "MC") {
                if (!q.optionA) {
                    ec++;
                    messageBuilder = messageBuilder.concat(ec + " . Pilihan A tidak boleh kosong <br/>");
                    isValid = false;
                }
                if (!q.optionB) {
                    ec++;
                    messageBuilder = messageBuilder.concat(ec + " . Pilihan B tidak boleh kosong <br/>");
                    isValid = false;
                }
                if (!q.optionC) {
                    ec++;
                    messageBuilder = messageBuilder.concat(ec + " . Pilihan C tidak boleh kosong <br/>");
                    isValid = false;
                }

            }

            if (!q.difficulty) {
                ec++;
                messageBuilder = messageBuilder.concat(ec + " . Taraf Kesukaran tidak boleh kosong <br/>");
                isValid = false;
            }

            messageBuilder = messageBuilder.concat('</p>');
            return {
                isValid: isValid,
                message: messageBuilder
            }
        }


        if ($stateParams.qId != null && $stateParams.qId != "") {
            $(document).ready(function() {
                findAll();
                findQuestionGroupDetail();
            })
            $scope.questionUpdate = true;
        } else {
            findAll();
        }

    }

})();
(function() {

    'use strict';
    angular.module('app').controller('TeacherAccountSetting', TeacherAccountSetting);

    TeacherAccountSetting.$inject = ['$scope', '$state', 'storageService'];

    function TeacherAccountSetting($scope, $state, storageService) {

        $scope.currentTeacher;

        /*
         * checking authorization
         */
        if (!storageService.isAuthorization("EMPLOYEE")) {
            $state.go("checkroute");
        } else {
            $scope.currentTeacher = storageService.getLoggedInUser();
        }

        $scope.backButton = function() {
            $state.go('^');
        };

    }

})();
(function() {

    'use strict';

    angular
        .module('app')
        .controller('ChapterController', ChapterController);

    ChapterController.$inject = ['$scope', '$stateParams', '$state', 'subjectService', 'storageService', 'errorHandle', '$timeout', 'DialogFactory'];

    function ChapterController($scope, $stateParams, $state, subjectService, storageService, errorHandle, $timeout, DialogFactory) {

        /*
         * checking authorization
         */

        var token = " ";
        $scope.currentTeacher = null;
        if (!storageService.isAuthorization("EMPLOYEE")) {
            $state.go("checkroute");
        } else {
            token = storageService.getToken();
            $scope.currentTeacher = storageService.getLoggedInUser();
            console.log($scope.currentTeacher);
        }

        $scope.chapters = [];
        $scope.isUpdate = false;
        $scope.subjects = [];
        $scope.selectedChapter = {
            'id': null,
            'subject': null,
            'tagName': null,
            'deleted': false,
            'teacher': $scope.currentTeacher
        };

        $scope.showModal = false;
        $scope._index = 0;

        $scope.toggleModal = function(index, chapterModel) {
            $scope._index = index;
            $scope.selectedChapter = chapterModel;
            DialogFactory.confDialogMsg('Konfirmasi Hapus Data', 'Apakah anda yakin untuk menghapus sub materi?', 'md')
                .then(function(response) {
                    if (response) {
                        $scope.delete();
                    }
                }, function(dismiss) {});
        };

        /*
         *This Function used to fetch all teacher data
         */
        function findAllSubejct() {
            var promise = subjectService.fetchAllSubject(token);
            promise.then(
                function(response) {
                    $scope.subjects = response.data;
                },
                function(errorResponse) {
                    errorHandle.setError(errorResponse);
                });
        };

        /*
         *This Function used to fetch all teacher data
         */
        function findAll() {
            var promise = subjectService.fetchAllChapter($scope.currentTeacher.id, token);
            promise.then(
                function(response) {
                    $scope.chapters = response.data;
                },
                function(errorResponse) {
                    errorHandle.setError(errorResponse);
                });
        };

        /*
         * fin subject by subject id to editing selected subject
         */
        function findChapterById(id) {
            var promise = subjectService.findChapter(id, token);
            promise.then(
                function(response) {
                    $scope.selectedChapter = response.data;
                    console.log("Entering here");
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
            if (!$scope.isUpdate) {
                $scope.selectedChapter.subject = JSON.parse($scope.selectedChapter.subject);
            }
            var params = [{
                'authorization': token,
                'tag': {
                    'tagId': $scope.selectedChapter.id,
                    'tagName': $scope.selectedChapter.tagName,
                    'subjectId': $scope.selectedChapter.subject.id,
                    'teacherId': $scope.selectedChapter.teacher.id
                },
            }];

            var promise;
            if ($scope.isUpdate) {
                promise = subjectService.updateChapter(params);
                promise.then(
                    function(response) {
                        $state.go('teacher.chapter');
                    },
                    function(errorResponse) {
                        errorHandle.setError(errorResponse);
                    });
            } else {
                promise = subjectService.createChapter(params);
                promise.then(
                    function(response) {
                        $state.go('teacher.chapter');
                    },
                    function(errorResponse) {
                        if (errorResponse.status == 404) {
                            DialogFactory.showDialogMsg("Simpan Data Gagal", "Matapelajaran sudah pernah dibuat", "md");
                        } else {
                            errorHandle.setError(errorResponse);
                        }
                    });
            }
        };

        /*
         * used for deleting selected chapter by chapter id
         */
        $scope.delete = function() {
            $scope.chapters.splice($scope._index, 1);
            var promise = subjectService.deleteChapter($scope.selectedChapter.id, token);
            promise.then(
                function(response) {
                    $scope.showModal = false;
                },
                function(errorResponse) {
                    errorHandle.setError(errorResponse);
                });
        };

        $scope.update = function(id) {
            if (id != null) {
                $state.go('teacher.chapter.createOrUpdate', {
                    'chapterId': id
                });
            }
        }


        findAllSubejct();

        if ($state.is('teacher.chapter')) {
            findAll();
        } else if ($state.is('teacher.chapter.createOrUpdate')) {
            if ($stateParams.chapterId != undefined && $stateParams.chapterId != null && $stateParams.chapterId != "") {
                findChapterById($stateParams.chapterId);
                $scope.isUpdate = true;
            } else {
                $scope.isUpdate = false;
            }
        }
    }

})();
(function() {

    'use strict';
    angular.module('app').controller('QuestionBankImportController', QuestionBankImportController);

    QuestionBankImportController.$inject = ['$scope', '$stateParams', '$state', 'queastionBankService', 'teacherService', 'storageService', 'DialogFactory', 'errorHandle', 'bsLoadingOverlayService', '$timeout'];

    function QuestionBankImportController($scope, $stateParams, $state, queastionBankService, teacherService, storageService, DialogFactory, errorHandle, bsLoadingOverlayService, $timeout) {

        var currentTeacher;
        var token = '';
        var questionBankId = $stateParams.questionBankId;

        if (!storageService.isAuthorization("EMPLOYEE")) {
            $state.go("checkroute");
        } else {
            currentTeacher = storageService.getLoggedInUser();
            token = storageService.getToken();
        }
        var self = this;
        self.file = null;
        $scope.isPassage = false;

        $scope.questionBanks = [];
        $scope.questions = [];
        $scope.importModel = {
            questionBankName: '',
            questionPoolId: '',
            questionGroupType: 'MC_OR_TF',
            passage: ''
        };

        $scope.isPassageChange = function(param) {
            if (param) {
                $scope.importModel.questionGroupType = 'PASSAGE'
            } else {
                $scope.importModel.questionGroupType = 'MC_OR_TF'
            }
        }

        $(document).ready(function() {
            $(":file").filestyle({ input: false, buttonName: 'btn-default', buttonText: 'Pilih Berkas XLS' });
            var element = document.getElementById('xlsFile');
            if (element) {
                element.addEventListener('change', function(e) {
                    self.file = e.target.files[0];
                    console.log(self.file);
                });
            }
        });

        $scope.resultVisible = 0;
        $scope.setVis = function() {
            $scope.resultVisible = 1;
        }

        /*
         * Fetch All Question Bank
         */
        function findQuestionById() {
            var promise = queastionBankService.findQuestionBank(questionBankId, token, currentTeacher.id);
            promise.then(
                function(response) {
                    $scope.importModel.questionBankName = response.data.questionPoolName;
                    $scope.importModel.questionPoolId = response.data.id;
                },
                function(errorResponse) {
                    errorHandle.setError(errorResponse);
                }
            )
        };

        $scope.saveImportData = function() {
            bsLoadingOverlayService.start({
                referenceId: 'loading'
            });
            queastionBankService.importQuestionBank(token, self.file, $scope.importModel).then(
                function(response) {
                    $timeout(function() {
                        bsLoadingOverlayService.stop({
                            referenceId: 'loading'
                        });
                        $scope.questions = response.data;
                        $scope.resultVisible = 1;
                    }, 1500);
                },
                function(errorResponse) {
                    $timeout(function() {
                        bsLoadingOverlayService.stop({
                            referenceId: 'loading'
                        })
                    }, 1500);
                    errorHandle.setError(errorResponse);
                }
            );
        };

        $scope.checkKey = function(key) {
            var result = "";
            if (key) {
                if (key === "true") {
                    result = "BENAR";
                } else if (key === "false") {
                    result = "SALAH";
                } else {
                    result = key;
                }
            } else {
                result = "---";
            }
            return result;
        };

        $scope.checkDiff = function(diff) {
            var result = "";
            if (diff) {
                if (diff === "EASY") {
                    result = "MUDAH";
                } else if (diff === "MEDIUM") {
                    result = "SEDANG";
                } else {
                    result = "SUKAR";
                }
            } else {
                result = "---";
            }
            return result;
        };

        findQuestionById();


    }

})();
(function() {
    'use strict';
    StudentDashboardController.$inject = ["$scope", "$state", "taskService", "studentService", "storageService", "errorHandle", "schoolProfileService", "tinyMce"];
    angular.module('app').controller('StudentDashboardController', StudentDashboardController);

    StudentDashboardController.inject = ['$scope', '$state', 'taskService', 'studentService', 'storageService', 'errorHandle', 'schoolProfileService', 'tinyMce'];

    function StudentDashboardController($scope, $state, taskService, studentService, storageService, errorHandle, schoolProfileService, tinyMce) {
        var currentStudent;
        var token;
        $scope.selectedStudent;
        $scope.schoolProfile = {
            "schoolName": "",
            "schoolDescription": "",
            "content": "images/profile.png"
        };

        /*
         * checking authorization
         */
        if (!storageService.isAuthorization("STUDENT")) {
            $state.go("checkroute");
        } else {
            token = storageService.getToken();
            currentStudent = storageService.getLoggedInUser();
            findStudent(currentStudent.nis).then(function() {
                getAllPublishedTask($scope.selectedStudent.kelas.id);
                fetchScoolProfile();
            });
        }

        $scope.trustAsHtml = tinyMce.trustAsHtml;

        $scope.notification = [{
            type: 'TUGAS',
            count: 0,
            visible: false
        }, {
            type: 'KUIS',
            count: 0,
            visible: false
        }, {
            type: 'TRYOUT_UTS|TRYOUT_UAS',
            count: 0,
            visible: false
        }, {
            type: 'TRYOUT_UAN',
            count: 0,
            visible: false
        }];

        function findStudent(nis) {
            var promise = studentService.findStudent(nis, token);
            promise.then(
                function(response) {
                    $scope.selectedStudent = response.data;
                    $scope.selectedStudent.birthDate = new Date(response.data.birthDate);
                },
                function(error) {
                    errorHandle.setError(error);
                }
            );
            return promise;
        };

        function fetchScoolProfile() {
            var promise = schoolProfileService.fetchProfile(token);
            promise.then(
                function(response) {
                    $scope.schoolProfile = response.data;
                    $scope.schoolProfile.content = 'data:' + $scope.schoolProfile.contentType + ';base64,' + $scope.schoolProfile.fileData;
                },
                function(error) {
                    errorHandle.setError(error);
                }
            );
            return promise;
        };

        function getAllPublishedTask(classId) {
            var promise = taskService.fetchAllPublishedTask(classId, token);
            promise.then(
                function(response) {
                    angular.forEach(response.data, function(d) {
                        if (d.eventType == 'TUGAS') {
                            $scope.notification[0].count = $scope.notification[0].count + 1;
                            $scope.notification[0].visible = true;
                        } else if (d.eventType == 'KUIS') {
                            $scope.notification[1].count = $scope.notification[1].count + 1;
                            $scope.notification[1].visible = true;
                        } else if (d.eventType == 'TRYOUT_UAN') {
                            $scope.notification[3].count = $scope.notification[3].count + 1;
                            $scope.notification[3].visible = true;
                        } else {
                            $scope.notification[2].count = $scope.notification[2].count + 1;
                            $scope.notification[2].visible = true;
                        }
                    });
                },
                function(error) {
                    errorHandle.setError(error);
                });
        };

    }
})();
(function() {

    'use strict';
    angular.module('app').controller('StudentTaskController', StudentTaskController);

    StudentTaskController.$inject = ['$scope', '$state', 'taskService', '$stateParams', 'studentService', 'storageService', 'errorHandle', 'DialogFactory'];

    function StudentTaskController($scope, $state, taskService, $stateParams, studentService, storageService, errorHandle, DialogFactory) {

        var currentStudent;
        var token = "";

        /*
         * checking authorization
         */
        if (!storageService.isAuthorization("STUDENT")) {
            $state.go("checkroute");
        } else {
            currentStudent = storageService.getLoggedInUser();
            token = storageService.getToken();

        }

        /*
         * Global Variable
         */
        $scope.titleData = {
            availableOptions: [{
                'title': 'Tugas',
                'ico': 'tugas_1.png',
                'value': 'TUGAS'
            }, {
                'title': 'Kuis',
                'ico': 'quiz_1.png',
                'value': 'KUIS'
            }, {
                'title': 'Tryout UTS/UAS',
                'ico': 'uas_1.png',
                'value': 'TRYOUT_UTS|TRYOUT_UAS'
            }, {
                'title': 'Tryout UAN',
                'ico': 'uan_1.png',
                'value': 'TRYOUT_UAN'
            }],
            selectedOption: null
        };

        $scope.paginationVisible = false;
        $scope.tasks = [];
        $scope.pageConfig = {
            currentPage: 1,
            maxSize: 5,
            itemPage: 4,
            totalItem: 0,
            boundaryLink: true,
            rotate: false
        };

        $scope.kerjakan = function(eventId) {
            var params = [];
            var param = {
                'authorization': token,
                'studentAnswer': {
                    'nis': currentStudent.nis,
                    'eventId': eventId
                }
            };

            params.push(param);
            var promise = taskService.createStudentAnswer(params);
            promise.then(
                function(response) {
                    $state.go('student.task.exam', {
                        'eventId': eventId
                    });
                },
                function(errorResponse) {
                    errorHandle.setError(errorResponse);
                });

        };

        $scope.pembahasan = function(data) {
            if (data.status == 'COMPLETED') {
                $state.go('student.task.explanation', {
                    'eventId': data.id
                });
            } else {
                DialogFactory.showDialogMsg("Pembahasan Belum Tersedia", "Pembahasan bisa di akses setelah ujian berakhir", "md");

            }
        }

        $scope.disableKerjakan = function(data) {
            var result = false;
            if (data.finish || data.status != 'RELEASED') {
                result = true;
            } else if (!data.finish && data.status == 'RELEASED') {
                result = false;
            }
            return result;
        }

        $scope.disablePembahasan = function(data) {
            var result = false;
            if (data.finish || data.status == 'COMPLETED') {
                result = false;
            } else {
                result = true;
            }
            return result;
        }

        /*
         * get All Event
         */
        function getAllTask(eventType) {
            $scope.paginationVisible = false;
            var promise = taskService.fetchAllTask(eventType, $scope.selectedStudent, token);
            promise.then(
                function(response) {
                    $scope.tasks = [];
                    angular.forEach(response.data, function(d) {
                        var task = {
                            data: null,
                            img_path: '',
                            img_ext: '',
                        };
                        task.data = d;
                        task.img_path = 'images/thumbnail-tpl/';
                        task.img_ext = '_1.png';
                        $scope.tasks.push(task);
                    });
                    $scope.pageConfig.totalItem = $scope.tasks.length;
                    if ($scope.tasks.length > 0) {
                        $scope.paginationVisible = true;
                    }
                },
                function(error) {
                    errorHandle.setError(error);
                }
            );
        }

        /*
         *This Function used to find student by NIS
         *@param student.nis
         */
        $scope.selectedStudent;

        function findStudent(nis) {
            var promise = studentService.findStudent(nis, token);
            promise.then(
                function(response) {
                    $scope.selectedStudent = response.data;
                    $scope.selectedStudent.birthDate = new Date(response.data.birthDate);
                },
                function(errorResponse) {
                    errorHandle.setError(errorResponse);
                });
            return promise;
        };

        /*
         * Refreshing Task
         */
        $scope.refreshTask = function(eventType) {
            getAllTask(eventType);
        }

        /*
         * state condition
         */
        if ($stateParams.eventType == 'tugas') {
            $scope.titleData.selectedOption = $scope.titleData.availableOptions[0];
            findStudent(currentStudent.nis).then(function() {
                getAllTask($scope.titleData.selectedOption.value);
            });
        } else if ($stateParams.eventType == 'kuis') {
            $scope.titleData.selectedOption = $scope.titleData.availableOptions[1];
            findStudent(currentStudent.nis).then(function() {
                getAllTask($scope.titleData.selectedOption.value);
            });
        } else if ($stateParams.eventType == 'tryout_uas') {
            $scope.titleData.selectedOption = $scope.titleData.availableOptions[2];
            findStudent(currentStudent.nis).then(function() {
                getAllTask($scope.titleData.selectedOption.value);
            });
        } else if ($stateParams.eventType == 'tryout_uan') {
            $scope.titleData.selectedOption = $scope.titleData.availableOptions[3];
            findStudent(currentStudent.nis).then(function() {
                getAllTask($scope.titleData.selectedOption.value);
            });
        }

    }
})();
(function() {

    'use strict';
    angular.module('app').controller('StudentExamController', StudentExamController);

    StudentExamController.$inject = ['$scope', '$stateParams', '$timeout', 'queastionBankService', 'studentService', 'eventService', 'studentExamService', '$state', 'storageService', 'errorHandle', 'tinyMce', 'DialogFactory', '$window'];

    function StudentExamController($scope, $stateParams, $timeout, queastionBankService, studentService, eventService, studentExamService, $state, storageService, errorHandle, tinyMce, DialogFactory, $window) {

        var currentStudent;
        var token = " ";
        $scope.selectedStudent = "";
        $scope.selectedEvent = {};
        $scope.eventQuestions = [];
        $scope.configuration = {
            selector: 'textarea',
            height: 200,
            menubar: '',
            plugins: [
                'advlist autolink lists link image charmap print preview hr anchor pagebreak',
                'searchreplace wordcount visualblocks visualchars code fullscreen',
                'insertdatetime media nonbreaking save table contextmenu directionality',
                'emoticons template paste textcolor colorpicker textpattern imagetools tiny_mce_wiris'
            ],
            toolbar1: 'bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | tiny_mce_wiris_formulaEditor',
            image_advtab: true,
            resize: false,
            setup: function(e) {
                e.on('blur', function() {
                    // Get the raw contents of the currently active editor
                    var content = tinyMCE.activeEditor.getContent({ format: 'raw' });
                    $scope.updateAnswer(content);
                });

            },
            statusbar: false,
            images_dataimg_filter: function(img) {
                return img.hasAttribute('internal-blob');
            }
        };

        $scope.listAnswer = [];
        $scope.selectedAns = [];
        $scope.currentIndex = 0;
        $scope.keys = [];
        $scope.max = 0;
        $scope.studentAnswers = [];
        $scope.isExam = true;
        $scope.point = 0;
        $scope.timeWorking = 0;
        $scope.studentEventTime = { id: null };
        $scope.redirect = false;
        $scope.lastTimeout;
        $scope.examProgress = getProgress();

        $scope.trustAsHtml = tinyMce.trustAsHtml;
        $scope.currentQuestion = {
            answered: null,
            correct: false,
            event: null,
            id: null,
            question: {}
        };

        $scope.convertAnsweer = function(value) {
            if (value === "false") {
                return " F";
            } else if (value === "true") {
                return " T"
            } else {
                return value;
            }
        }


        /*
         * checking authorization
         */
        if (!storageService.isAuthorization("STUDENT")) {
            $state.go("checkroute");
        } else {
            currentStudent = storageService.getLoggedInUser();
            token = storageService.getToken();
        }

        /*
         *
         */
        function fetchStudentAnswer(eventId, nis) {
            var promise = studentExamService.fetchStudentAnswer(eventId, nis, token);
            promise.then(
                    function(response) {
                        $scope.studentAnswers = [];
                        angular.forEach(response.data, function(d) {
                            d.question.key = d.question.key.split("#")[1];
                            $scope.studentAnswers.push(d);
                        });

                    },
                    function(errorResponse) {
                        errorHandle.setError(errorResponse);
                    })
                .then(function() {
                    updateQuestion();
                    $scope.max = $scope.studentAnswers.length - 1;
                    $scope.examProgress = getProgress();
                });
        };

        function countPoint(data) {
            var counter = 0;
            angular.forEach(data, function(d) {
                if (d.correct) {
                    counter = counter + 1;
                }
            });
            $scope.point = (counter * 100 / data.length);
        }

        /*
         *
         */
        function fetchStudentExplanation(eventId, nis) {
            var promise = studentExamService.fetchStudentExplanation(eventId, nis, token);
            promise.then(
                    function(response) {
                        $scope.studentAnswers = response.data;
                    },
                    function(errorResponse) {
                        errorHandle.setError(errorResponse);
                    })
                .then(
                    function() {
                        updateQuestion();
                        $scope.max = $scope.studentAnswers.length - 1;
                        countPoint($scope.studentAnswers);
                        $scope.examProgress = getProgress();
                    }
                );
        };

        function getProgress() {
            var answerCount = 0;
            $scope.studentAnswers.forEach(function(element) {
                if (element.answered) {
                    answerCount++;
                }
            });
            return answerCount + "/" + $scope.studentAnswers.length;
        }


        $scope.updateAnswer = function(param) {
            if ($state.is('student.task.exam')) {

                if (param) {

                    $scope.currentQuestion.answered = param;

                    $scope.examProgress = getProgress();
                }
                if ($scope.currentQuestion != null && $scope.currentQuestion != undefined) {
                    var params = [{
                        'authorization': token,
                        'studentAnswer': {
                            'id': $scope.currentQuestion.id,
                            'ans': $scope.currentQuestion.answered
                        }
                    }];
                    var promise = studentExamService.updateStudentAnswer(params);
                    promise.then(function(response) {
                        saveLastWorkingTime({ "message": "reloadEvent", "type": "update", "id": $scope.studentEventTime.id });
                    }, function(errorResponse) {

                    });
                }
            }
        };

        /*
         * get event by id
         */
        function findEvent(eventId) {
            var promise = eventService.findEvent(eventId, token);
            promise.then(
                    function(response) {
                        $scope.selectedEvent = response.data;
                        if ($scope.isExam) {

                            findLastWorkingTime($scope.selectedEvent.workingTime);
                        }
                    },
                    function(error) {
                        errorHandle.setError(error);
                    })
                .then(function() {
                    updateQuestion();
                });
        }

        /*
         * get question by event id
         */
        function fetchQuestionByEventId() {
            var eventId = $stateParams.eventId;
            if (eventId != undefined && eventId != null) {
                var promise = queastionBankService.fetchQuestionByEventId(eventId, token);
                promise.then(
                    function(response) {
                        $scope.eventQuestions = response.data;
                    },
                    function(errorResponse) {
                        errorHandle.setError(errorResponse);
                    });
            }
        };

        /*
         *This Function used to find student by NIS
         *@param student.nis
         */
        function findStudent(nis) {
            var promise = studentService.findStudent(nis, token);
            promise.then(
                function(response) {
                    $scope.selectedStudent = response.data;
                    $scope.selectedStudent.birthDate = new Date(response.data.birthDate);
                },
                function(errorResponse) {
                    errorHandle
                }
            );
        };

        $scope.questionType = "";

        function updateQuestion() {
            $scope.currentQuestion = $scope.studentAnswers[$scope.currentIndex];
            if ($scope.currentQuestion != undefined) {
                $scope.questionType = $scope.currentQuestion.question.typeQuestion;
            }
        }

        $scope.nextSlide = function() {
            console.log("entering here");
            if ($scope.currentIndex <= $scope.studentAnswers.length - 1) {
                $scope.currentIndex = $scope.currentIndex + 1;
                updateQuestion();
            }
        };

        $scope.prevSlide = function() {
            console.log("Prev Slide=> " + $scope.currentIndex);
            if ($scope.currentIndex >= 0) {
                $scope.currentIndex = $scope.currentIndex - 1;
                updateQuestion();
            }
        };

        /**
        Handling the direct clicked from list of answered questions
        */
        $scope.currentSlide = function(idx) {
            console.log("idx===> " + idx);
            $scope.currentIndex = idx - 1;
            updateQuestion();
        };

        $scope.counter = 0;
        $scope.timeWorking = null;
        $scope.onTimeout = function() {

            $scope.counter--;
            $scope.timeWorking = new Date(0, 0, 0).setSeconds($scope.counter);
            if ($scope.counter === 300) {
                DialogFactory.showReminderMsg("Peringatan", "5 menit lagi waktu akan habis", "md");
                var timeout = $timeout($scope.onTimeout, 1000);
                $timeout.cancel($scope.lastTimeout);
                $scope.lastTimeout = timeout;
                angular.element('#working-time').css('color', 'red');
                angular.element('#working-time').css('font-weight', 'bold');
            } else if ($scope.counter > 0) {
                var timeout = $timeout($scope.onTimeout, 1000);
                $timeout.cancel($scope.lastTimeout);
                $scope.lastTimeout = timeout;
            } else {
                DialogFactory.showDialogMsg("Ujian Selesai", "Waktu Telah Habis", "md");
                $timeout.cancel($scope.lastTimeout);
                $scope.redirect = true;
                $state.go('student.task.exam.result');
            }
        }

        function startTimer(time) {
            $scope.counter = time;
            var timeout = $timeout($scope.onTimeout, 1000);
            $scope.lastTimeout = timeout;
        }

        $scope.finishExamintion = function() {
            $timeout.cancel($scope.lastTimeout);
            $scope.redirect = true;
            $state.go('student.task.exam.result');
        }

        /*
         * checking authorization
         */
        if (!storageService.isAuthorization("STUDENT")) {
            $state.go("login");
        } else {
            currentStudent = storageService.getLoggedInUser();
            token = storageService.getToken();
            findStudent(currentStudent.nis);
            findEvent($stateParams.eventId);
        }

        if ($state.is('student.task.exam')) {
            $scope.isExam = true;
            fetchStudentAnswer($stateParams.eventId, currentStudent.nis);
        } else if ($state.is('student.task.explanation')) {
            $scope.isExam = false;
            fetchStudentExplanation($stateParams.eventId, currentStudent.nis);
        }

        $window.onbeforeunload = function() {
            if ($state.is('student.task.exam')) {
                saveLastWorkingTime({ "message": "reloadEvent", "type": "update", "id": $scope.studentEventTime.id });
            }
        }

        $scope.$on('$stateChangeStart', function(event, scope, next, current) {
            // saveLastWorkingTime({ "message": "backButtonEvent", "type": "update", "id": $scope.studentEventTime.id });
            if ($state.is("student.task.exam") && !$scope.redirect) {
                event.preventDefault();
            }

            if ($state.is("student.task.exam") && !$scope.redirect) {
                var result = DialogFactory.confDialogMsg(
                    "Pemberitahuan",
                    "Apakah anda ingin menyelesaikan ujian ini ?",
                    "md");

                result.then(
                    function(value) {
                        if (value) {
                            $timeout.cancel($scope.lastTimeout);
                            $scope.redirect = true;
                            $state.go('student.task.exam.result');
                        } else {
                            event.preventDefault();
                        }
                    },
                    function(error) {

                    }
                );
            }


        });

        function saveLastWorkingTime(param) {
            console.log(param.message);
            var params = [];
            if (param.type === "save") {
                params = [{
                    'authorization': token,
                    'eventId': $stateParams.eventId,
                    'studentId': currentStudent.nis,
                    'lastUpdatedTime': ($scope.selectedEvent.workingTime * 60)
                }];
            } else {
                params = [{
                    'authorization': token,
                    'id': param.id,
                    'lastUpdatedTime': $scope.counter
                }];
            }

            var promise = studentExamService.saveOrUpdateTime(params);
            promise.then(
                function(response) {
                    if (param.message === "backButtonEvent") {
                        $timeout.cancel($scope.lastTimeout);
                    }
                },
                function(errorResponse) {

                }
            );
        }

        function findLastWorkingTime(timeParam) {
            var promise = studentExamService.findLastWorkingTime($stateParams.eventId, currentStudent.nis, token);
            promise.then(
                function(response) {
                    $scope.studentEventTime = response.data;
                    startTimer($scope.studentEventTime.lastUpdatedTime);
                },
                function(errorResponse) {
                    if (errorResponse.status === 404) {
                        saveLastWorkingTime({ "message": "init student working time", "type": "save", "id": null });
                        startTimer(timeParam * 60);
                    }
                }
            );
        }

    }
})();
(function() {

    'use strict';
    angular.module('app').controller('ExamResultController', ExamResultController);

    ExamResultController.$inject = ['$scope', '$stateParams', 'studentExamResultService', 'storageService', 'errorHandle'];

    function ExamResultController($scope, $stateParams, studentExamResultService, storageService, errorHandle) {

        var currentStudent = null;
        var token = " ";
        /*
         * checking authorization
         */
        if (!storageService.isAuthorization("STUDENT")) {
            $state.go("checkroute");
        } else {
            currentStudent = storageService.getLoggedInUser();
            token = storageService.getToken();
        }

        function fetchStudentResult(eventId, nis) {
            var params = [{
                'authorization': token,
                'studentResult': {
                    'eventId': eventId,
                    'nis': nis
                }
            }];
            var promise = studentExamResultService.fetchStudentResult(params);
        };

        fetchStudentResult($stateParams.eventId, currentStudent.nis);
        $scope.$on('$stateChangeStart', function(event, next, current) {
            if (next.name === "student.task.exam") {
                event.preventDefault();
            }
        });
    }
})();
(function() {

    'use strict';
    angular.module('app').controller('LoginController', LoginController);

    LoginController.$inject = ['$scope', '$stateParams', '$state', '$timeout', 'loginService', 'localStorageService', '$rootScope', 'DialogFactory', 'storageService'];

    function LoginController($scope, $stateParams, $state, $timeout, loginService, localStorageService, $rootScope, DialogFactory, storageService) {
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
            } else {
                storageService.isUserExistThenRedirectTo();
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
                                message = "Maaf jumlah siswa yang diperbolehkan login sudah memnuhi kuota";
                            } else if (errorResponse.status == 417) {
                                title = "Gagal Masuk";
                                message = "Akun dengan nama pengguna <b><i>'" + $scope.user.un + "'</i></b> sedang aktif, silahkan tunggu hingga sesi pengguna habis.";
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
    }
})();
(function() {

    'use strict';
    angular.module('app').controller('LogoutController', LogoutController);

    LogoutController.$inject = ['$scope', '$state', 'localStorageService', '$http', 'baseUrl', 'DialogFactory'];

    function LogoutController($scope, $state, localStorageService, $http, baseUrl, DialogFactory) {
        $scope.user = localStorageService.get("USER");

        $scope.loggedOut = function() {
            var url = baseUrl.getUrl();
            var tokens = [{
                'token': localStorageService.get("TOKEN")
            }];

            $http.post(url + '/user/authorization/loggedOut/', tokens);
            localStorageService.remove("USER");
            localStorageService.remove("TOKEN");
            $state.go("login")

        }

        $scope.openCredit = DialogFactory.openCredit;
    }
})();
(function() {

    'use strict';
    angular.module('app').controller('ChangePasswordController', ChangePasswordController);

    ChangePasswordController.$inject = ['$scope', '$state', 'storageService', 'errorHandle', 'changePswdService', 'DialogFactory'];

    function ChangePasswordController($scope, $state, storageService, errorHandle, changePswdService, DialogFactory) {

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
            var title = "Ubah Kata Sandi Gagal";
            if (status == 404) {
                message = "Kata sandi lama salah";
            } else if (status == 417) {
                message = "Konfirmasi kata sandi baru salah";
            } else if (status == 409) {
                message = "Kata sandi baru masih sama dengan kata sandi lama";
            } else if (status == 200) {
                message = "Kata sandi berhasil di ganti";
                title = "Ubah Kata Sandi Berhasil";
            }

            DialogFactory.showDialogMsg(title, message, "md");
        }

        $scope.saveNewPass = function() {
            var promise = changePswdService.updatePassword($scope.data, token, user.userName);
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

    }

})();