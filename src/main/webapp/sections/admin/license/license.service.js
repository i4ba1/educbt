(function() {

    'use strict';
    angular.module('app').factory('licenseService', licenseService);

    licenseService.$inject = ['$http', 'baseUrl'];

    function licenseService($http, baseUrl, ) {
        var url = baseUrl.getUrl();
        var remoteUrl = baseUrl.getRemote();
        return {

            saveLicense: function(license, token) {
                var params = [{
                    'authorization': token,
                    'license': license,
                    'activationKey': "",
                    'registerDate': new Date().getTime()
                }];
                return $http.post(url + '/admin/license/create/', params);
            },
            fetchAllLicense: function(token) {
                return $http.get(url + '/admin/license/' + token);
            },
            deleteLicense: function(id, token) {
                return $http.delete(url + '/admin/license/delete/' + token + '/' + id);
            },
            activateByInternet: function(obj, token) {

                var license = {
                    "id": obj.id,
                    "license": obj.license,
                    "passKey": obj.passKey,
                    "activationKey": obj.activationKey,
                    "createdDate": obj.createdDate,
                    "xlock": obj.xlock,
                    "macAddr": obj.macAddr,
                    "numberOfClient": obj.numberOfClient,
                    "licenseStatus": obj.licenseStatus
                }

                return $http.post(url + '/admin/license/activateByInternet/', [{ authorization: token, license: license }]);

            },

            manualActivation: function(obj, token) {
                var license = {
                    "id": obj.id,
                    "license": obj.license,
                    "passKey": obj.passKey,
                    "activationKey": obj.activationKey,
                    "createdDate": obj.createdDate,
                    "xlock": obj.xlock,
                    "macAddr": obj.macAddr,
                    "numberOfClient": obj.numberOfClient,
                    "licenseStatus": obj.licenseStatus
                }

                return $http.post(url + '/admin/license/activate/', [{ authorization: token, license: license }]);

            }

        };
    }

})();