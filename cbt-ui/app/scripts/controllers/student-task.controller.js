(function() {

    'use strict';
    angular.module('app').controller('StudentTaskController', StudentTaskController);

    StudentTaskController.$inject = ['$scope', '$state', 'taskService', '$stateParams', 'studentService', 'storageService', 'errorHandle', 'DialogFactory', 'localStorageService'];

    function StudentTaskController($scope, $state, taskService, $stateParams, studentService, storageService, errorHandle, DialogFactory, localStorageService) {

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
                'value': 'TRYOUT_UTS_TRYOUT_UAS'
            }, {
                'title': 'Tryout UAN',
                'ico': 'uan_1.png',
                'value': 'TRYOUT_UAN'
            }],
            selectedOption: null
        };
        $scope.displayMode = localStorageService.get("DISPLAY_MODE") ? localStorageService.get("DISPLAY_MODE") : "grid";
        $scope.paginationVisible = false;
        $scope.tasks = [];
        $scope.pageConfig = {
            currentPage: 1,
            maxSize: 5,
            itemPage: $scope.displayMode === "grid" ? 4 : 10,
            totalItem: 0,
            boundaryLink: true,
            rotate: false
        };

        $scope.changeDisplayMode = function(param) {
            $scope.displayMode = param;
            localStorageService.set("DISPLAY_MODE", param);
            if (param === 'grid') {
                $scope.pageConfig.itemPage = 4;
            } else {
                $scope.pageConfig.itemPage = 10;
            }
            $scope.pageConfig.currentPage = 1;
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