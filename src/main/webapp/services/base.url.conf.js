angular.module('app.core')
  .factory('baseUrl', ['$http', function($http) {
    return {
      getUrl: function() {
        return "http://192.168.0.174:8787/cbt-backend";
      }
    };
  }]);
