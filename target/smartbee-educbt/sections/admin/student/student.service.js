angular.module('app.core')
  .factory('studentService', ['$http', '$q', 'baseUrl', function($http, $q, baseUrl) {
    var url = baseUrl.getUrl();
    return {
      fetchAllStudents: function(token) {
        return $http.get(url + '/admin/student_mgmt/' + token);
      },
      findStudent: function(nis, token) {
        return $http.get(url + '/admin/student_mgmt/find/' + token + '/' + nis);
      },
      createStudent: function(params) {
        return $http.post(url + '/admin/student_mgmt/create/', params);
      },
      updateStudent: function(params) {
        return $http.put(url + '/admin/student_mgmt/update/', params);
      },
      deleteStudent: function(id, token) {
        return $http.delete(url + '/admin/student_mgmt/delete/' + token + '/' + id)
      },
      importStudent: function(params) {
        return $http.post(url + '/admin/student_mgmt/import/', params)
      }
    };
  }]);
