(function() {
    'use strict';
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
            type: 'TRYOUT_UTS_TRYOUT_UAS',
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