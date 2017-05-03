angular.module('app.core')
  .factory('taskService', ['$http', '$q', 'baseUrl', function($http, $q, baseUrl) {
    var url = baseUrl.getUrl();
    return {
      fetchAllTask: function(eventType, student, token) {
        return $http.get(url + '/student/list_event/' + token + '/' + eventType + '/' + student.kelas.id + '/' + student.nis);
      },
      createStudentAnswer: function(params) {
        return $http.post(url + '/student/student_answer/create/', params);
      },
      fetchAllPublishedTask: function(classId, token) {
        return $http.get(url + '/student/findEventByClassId/' + token + '/' + classId);
      }
    };
  }]);
