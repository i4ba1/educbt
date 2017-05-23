(function() {

    'use strict';
    angular.module('app').factory('teacherService', teacherService);

    teacherService.$inject = ['$http', 'baseUrl'];

    function teacherService($http, baseUrl) {
        var url = baseUrl.getUrl();
        return {

            fetchAllTeacher: function(token) {
                return $http.get(url + '/admin/teacher_mgmt/' + token);
            },

            findTeacher: function(nip, token) {
                return $http.get(url + '/admin/teacher_mgmt/find/' + token + '/' + nip);
            },

            createTeacher: function(params) {
                return $http.post(url + '/admin/teacher_mgmt/create/', params);
            },

            importTeacher: function(params) {
                return $http.post(url + '/admin/teacher_mgmt/import/', params);
            },

            updateTeacher: function(params) {
                return $http.put(url + '/admin/teacher_mgmt/update/', params);
            },

            deleteTeacher: function(nip, token) {
                return $http.delete(url + '/admin/teacher_mgmt/delete/' + token + '/' + nip);
            }
        };

    }

})();