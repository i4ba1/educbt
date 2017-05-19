angular.module('app')
  .factory('changePswdService', ['$http', '$q', 'baseUrl', function($http, $q, baseUrl) {
    var url = baseUrl.getUrl();
    return {
      updatePassword: function(data, token, userName) {
        var params =[{
          'authorization': token,
          'password': data,
          'userName': userName
        }];

        return $http.post(url + '/user/changePass/update/', params);
      }
    };
  }]);
