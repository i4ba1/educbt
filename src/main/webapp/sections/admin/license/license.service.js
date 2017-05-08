angular.module('app.core')
    .factory('licenseService', ['$http', '$q', 'baseUrl', '$resource', function($http, $q, baseUrl, $resource) {
        var url = baseUrl.getUrl();
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
                var crud = $resource('http://192.168.5.188:8080/helpdesk/api/snManagement/registerAndActivated/:serialNumber', { serialNumber: serialNumber });
                return crud;
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

                license = JSON.stringify({ authorization: token, license: license });
                return $http.post(url + '/admin/license/activate/', license);

            }

        };
    }]);