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

        $scope.result = [];

        function fetchStudentResult(eventId, nis) {
            var params = [{
                'authorization': token,
                'studentResult': {
                    'eventId': eventId,
                    'nis': nis
                }
            }];
            var promise = studentExamResultService.fetchStudentResult(params);
            promise.then(
                function(response) {
                    $scope.result = response.data
                },
                function(errorResponse) {
                    errorHandle.setError(errorResponse);
                });
        };

        fetchStudentResult($stateParams.eventId, currentStudent.nis);
        $scope.$on('$stateChangeStart', function(event, next, current) {
            if (next.name === "student.task.exam") {
                event.preventDefault();
            }
        });
    }
})();