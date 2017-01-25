angular.module('app.core')
  .factory('studentExamResultService', ['$http', '$q', 'baseUrl', function($http, $q, baseUrl) {
    var url = baseUrl.getUrl();
    return {
      fetchStudentResult: function(params) {
        return $http.post(url + '/student/finish/', params);
      }
    };

  }]);
