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