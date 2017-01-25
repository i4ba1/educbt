angular.module('app.core')
  .factory('loginService', ['$http', '$q', 'baseUrl', function($http, $q, baseUrl) {
    var url = baseUrl.getUrl();
    return {

      loggingIn: function(user) {
        var users = [];
        users.push(user);
        return $http.post(url + '/user/authorization/loggingIn/', users);
      },
      createAdmin: function() {
        return $http.post(url + '/admin/adminMgmt/createAdmin/');
      },
      closeHandle: function(params) {
        return $http.post(url + '/user/closeHandle/forcedLogOut/', params);
      }
    };

  }]);
