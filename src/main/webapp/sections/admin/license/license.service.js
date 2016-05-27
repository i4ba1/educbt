angular.module('app.core')
  .factory('licenseService', ['$http', '$q', 'baseUrl', function($http, $q, baseUrl) {
    var url = baseUrl.getUrl();
    return {

      saveLicense: function(license, token) {
        var params = [{
          'authorization': token,
          'license': license
        }];
        return $http.post(url + '/admin/license/create/', params);
      },
      fetchAllLicense: function(token) {
        return $http.get(url + '/admin/license/' + token);
      },
      deleteLicense: function(id, token) {
        return $http.delete(url + '/admin/license/delete/' + token + '/' + id);
      },
    };
  }]);
