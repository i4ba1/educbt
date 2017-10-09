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