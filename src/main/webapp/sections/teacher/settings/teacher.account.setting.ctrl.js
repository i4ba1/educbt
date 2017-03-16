'use strict';
angular
    .module('app.core')
    .controller('TeacherAccountSetting', function($scope, $filter, ngTableParams,
        $stateParams, $state, storageService, localStorageService) {

        $scope.currentTeacher;

        /*
         * checking authorization
         */
        if (!storageService.isAuthorization("EMPLOYEE", localStorageService)) {
            $state.go("checkroute");
        } else {
            $scope.currentTeacher = storageService.getLoggedInUser(localStorageService);
        }

        $scope.backButton = function() {
            $state.go('^');
        };

    });