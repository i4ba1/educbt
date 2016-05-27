angular.module('app.core')
  .factory('storageService', ['$http', '$q', 'baseUrl', '$state', 'localStorageService', function($http, $q, baseUrl, $state, localStorageService) {
    var url = baseUrl.getUrl();
    var dataFactory = {};

    dataFactory.isAuthorization = function(role) {
      var result = false;
      var token = localStorageService.get("TOKEN");
      var loggedIn = localStorageService.get("USER");
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

    return dataFactory;

  }]);
