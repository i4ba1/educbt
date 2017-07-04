(function() {
    'use strict';
    angular.module('app').factory('changePswdService', );

    changePswdService.$inject = ['$http', 'baseUrl'];

    function changePswdService($http, baseUrl) {
        var url = baseUrl.getUrl();
        return {
            updatePassword: function(data, token, userName) {
                var params = [{
                    'authorization': token,
                    'password': data,
                    'userName': userName
                }];

                return $http.post(url + '/user/changePass/update/', params);
            }
        };
    }
})();