angular.module('app.core')
  .factory('activeUserService', ['$http', '$q', 'baseUrl', function($http, $q, baseUrl) {
    var url = baseUrl.getUrl();
    return {
      fetchAllActiveUser: function(token) {
        return $http.get(url + '/admin/activeUser/' + token);
      },
      deleteActiveUser: function(id, token) {
        return $http.delete(url + '/admin/activeUser/delete/' + token + '/' + id);
      },
    };
  }]);
