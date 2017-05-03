angular.module('app.core')
  .factory('classService', ['$http', '$q', 'baseUrl', function($http, $q, baseUrl) {
    var url = baseUrl.getUrl();
    return {

      fetchAllClass: function(token) {
        return $http.get(url + '/admin/kelas_mgmt/' + token);
      },
      findClass: function(id, token) {
        return $http.get(url + '/admin/kelas_mgmt/find/' + token + '/' + id);
      },
      createClass: function(params) {
        return $http.post(url + '/admin/kelas_mgmt/create/', params);
      },
      updateClass: function(params) {
        return $http.put(url + '/admin/kelas_mgmt/update/', params);
      },
      deleteClass: function(id, token) {
        return $http.delete(url + '/admin/kelas_mgmt/delete/' + token + '/' + id);
      },
      importClass: function(params) {
        return $http.post(url + '/admin/kelas_mgmt/import/', params);
      },
      fetchClassByEventId: function(eventId, token) {
        return $http.get(url + '/teacher/teacher_event_mgmt/findKelasByEventId/' + token + '/' + eventId);
      }
    };
  }]);
