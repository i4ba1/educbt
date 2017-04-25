angular.module('app.core')
    .factory('licenseService', ['$http', '$q', 'baseUrl', '$resource', function($http, $q, baseUrl, $resource) {
        var url = baseUrl.getUrl();
        return {

            saveLicense: function(license, token) {
                var params = [{
                    'authorization': token,
                    'license': license
                }];
                return $http.post(url + '/admin/license/create/', params);
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
            }

        };
    }]);