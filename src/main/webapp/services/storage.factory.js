(function() {

    'use strict';
    angular.module('app').factory('storageService', storageService);

    storageService.$inject = ['$http', 'baseUrl', '$state', 'localStorageService', '$rootScope'];

    function storageService($http, baseUrl, $state, localStorageService, $rootScope) {
        var url = baseUrl.getUrl();
        var dataFactory = {};
        var loggedIn;

        dataFactory.isAuthorization = function(role) {
            var result = false;
            var token = localStorageService.get("TOKEN");
            loggedIn = localStorageService.get("USER");
            $rootScope.type = localStorageService.get("APP-TYPE");
            if (loggedIn != undefined && (loggedIn.userType.toLowerCase() == role.toLowerCase())) {
                if (token != undefined) {
                    result = true;
                } else {
                    result = false;
                }
            }
            return result;
        };

        dataFactory.getLoggedInUser = function() {
            loggedIn = localStorageService.get("USER");
            return loggedIn;
        };

        dataFactory.loggedOut = function() {
            var url = baseUrl.getUrl();
            var tokens = [{
                'token': localStorageService.get("TOKEN")
            }];

            $http.post(url + '/user/authorization/loggedOut/', tokens);
            localStorageService.remove("USER");
            localStorageService.remove("TOKEN");
            $state.go("login")
        };

        dataFactory.getToken = function(service) {
            return localStorageService.get("TOKEN");
        };

        dataFactory.isUserExistThenRedirectTo = function() {
            var user = localStorageService.get("USER");
            if (user) {
                switch (user.userType.toLowerCase()) {
                    case "student":
                        $state.go("student");
                        break;
                    case "employee":
                        $state.go("teacher");
                        break;
                    case "admin":
                        $state.go("admin");
                        break;
                }
            } else {
                $state.go("login");
            }
        };

        return dataFactory;

    }

})();