angular.module('app.core')
  .factory('forgotPassService', ['$http', '$q', 'baseUrl', function(
    $http, $q,
    baseUrl) {
    var url = baseUrl.getUrl();
    return {
      findByNisOrNip: function(token, value) {
        return $http.get(url + '/forgotPass/forgot/'+token+'/'+value);
      },
    };
  }]);
