(function() {

    'use strict';
    angular.module('app').factory('studentExamResultService', studentExamResultService);

    studentExamResultService.$inject = ['$http', 'baseUrl'];

    function studentExamResultService($http, baseUrl) {
        var url = baseUrl.getUrl();
        return {
            fetchStudentResult: function(params) {
                return $http.post(url + '/student/finish/', params);
            }
        };

    }

})();