angular.module('app.core')
  .factory('studentExamService', ['$http', '$q', 'baseUrl', function($http, $q, baseUrl) {
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
      }
    };

  }]);
