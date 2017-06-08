(function() {

    'use strict';
    angular.module('app').factory('activeUserService', activeUserService);

    activeUserService.$inject = ['$http', 'baseUrl'];

    function activeUserService($http, baseUrl) {
        var url = baseUrl.getUrl();
        return {
            fetchAllActiveUser: function(token) {
                return $http.get(url + '/admin/activeUser/' + token);
            },
            deleteActiveUser: function(id, token) {
                return $http.delete(url + '/admin/activeUser/delete/' + token + '/' + id);
            },
        };
    }
})();