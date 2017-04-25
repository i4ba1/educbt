(function() {
    'use strict';
    angular.module('app.core')
        .factory('LicenseCRUD', ['$resource', function($resource) {
            return $resource('http://192.168.5.188:8080/helpdesk/api/snManagement/registerAndActivated/:serialNumber')
        }]);
})();