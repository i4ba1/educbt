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