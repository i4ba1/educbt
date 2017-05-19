(function() {
    'use strict';
    angular.module('app.core')
        .factory('ActiveUserService', ActiveUserService);

    ActiveUserService.$inject = ['$http', 'baseUrl'];

    function ActiveUserService($http, baseUrl) {
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