angular.module('app.core')
  .factory('baseUrl', ['$http', function($http) {
    return {
      getUrl: function() {
        //return "http://192.168.0.183:8787/smartbee-educbt";
        return "/smartbee-educbt";
      }
    };
  }]);
