(function() {

    'use strict';

    angular
        .module('app.core')
        .controller('DashboardController', DashboardController);

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