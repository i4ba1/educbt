(function() {
    'use strict';

    angular
        .module('app')
        .factory('baseUrl', baseUrl);

    baseUrl.$inject = ['$http'];

    function baseUrl($http) {
        return {
            getUrl: function() {
                return "/smartbee-educbt";
            },
            getRemote: function() {
                return "http://192.168.5.188:8080/helpdesk"
            }
        };
    }

})();