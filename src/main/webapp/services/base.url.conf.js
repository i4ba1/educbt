angular.module('app.core')
  .factory('baseUrl', ['$http', function($http) {
    return {
      getUrl: function() {
        //return "http://localhost:8787/smartbee-educbt";
        return "/smartbee-educbt";
      }
    };
  }]);
