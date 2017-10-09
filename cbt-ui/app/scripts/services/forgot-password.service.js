(function() {

    'use strict';
    angular.module('app').factory('forgotPassService', forgotPassService);

    forgotPassService.$inject = ['$http', 'baseUrl'];

    function forgotPassService($http, baseUrl) {
        var url = baseUrl.getUrl();
        return {
            findByNisOrNip: function(token, value) {
                return $http.get(url + '/forgotPass/forgot/' + token + '/' + value);
            },
        };
    }

})();