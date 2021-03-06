(function() {

    'use strict';
    angular.module('app').factory('studentExamService', studentExamService);

    studentExamService.$inject = ['$http', 'baseUrl'];

    function studentExamService($http, baseUrl) {
        var url = baseUrl.getUrl();
        return {
            fetchStudentAnswer: function(eventId, nis, token) {
                return $http.get(url + '/student/list_student_answer/' + token + '/' + eventId + '/' + nis);
            },
            updateStudentAnswer: function(params) {
                return $http.put(url + '/student/student_answer/update/', params);
            },
            fetchStudentExplanation: function(eventId, nis, token) {
                return $http.get(url + '/student/event_explanation/' + token + '/' + eventId + '/' + nis);
            },
            saveOrUpdateTime: function(params) {
                return $http.post(url + '/student/saveOrUpdateTime/', params);
            },
            findLastWorkingTime: function(eventId, nis, token) {
                return $http.get(url + '/student/findLastWorkingTime/' + token + '/' + eventId + '/' + nis);
            }
        };

    }

})();