(function() {

    'use strict';

    angular.module('app')
        .factory('LicenseService', LicenseService);

    LicenseService.$inject = ['$http', 'baseUrl'];

    function LicenseService($http, baseUrl, ) {
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
            manualActivate: function() {

            },
            fetchAllLicense: function(token) {
                return $http.get(url + '/admin/license/' + token);
            },
            deleteLicense: function(id, token) {
                return $http.delete(url + '/admin/license/delete/' + token + '/' + id);
            },
            licenseCrud: function(serialNumber) {

                var param = {
                    serialNumber: serialNumber.license,
                    passKey: serialNumber.passKey,
                    activationKey: serialNumber.activationKey,
                    registerDate: serialNumber.registerDate,
                    xlock: serialNumber.xlock,
                    macAddr: serialNumber.macAddr,
                    serialNumberStatus: serialNumber.licenseStatus
                }
                return $http.post(remoteUrl + '/api/snManagement/activateByInternet/', param);

            },

            dummySave: function(license, token) {
                var params = [{
                    'authorization': token,
                    'license': license,
                    'activationKey': "",
                    'registerDate': new Date().getTime()
                }];
                return $http.post(url + '/admin/license/dummyCreate/', params);
            },

            register: function(serialNumber) {

                var param = {
                    serialNumber: serialNumber.license,
                    passKey: serialNumber.passKey,
                    activationKey: serialNumber.activationKey,
                    registerDate: serialNumber.registerDate,
                    xlock: serialNumber.xlock,
                    macAddr: serialNumber.macAddr,
                    serialNumberStatus: serialNumber.licenseStatus
                }

                return $http.post(remoteUrl + '/api/snManagement/register/', param);

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