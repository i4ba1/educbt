(function() {

    'use strict';

    angular.module('app')
        .factory('ForgotPassService', ForgotPassService);

    ForgotPassService.$inject = ['$http', 'baseUrl'];

    function ForgotPassService($http, baseUrl) {
        var url = baseUrl.getUrl();
        return {
            findByNisOrNip: function(token, value) {
                return $http.get(url + '/forgotPass/forgot/' + token + '/' + value);
            },
        };
    }

})();