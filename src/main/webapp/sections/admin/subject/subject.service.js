angular.module('app.core')
  .factory('subjectService', ['$http', '$q', 'baseUrl', function($http, $q, baseUrl) {
    var url = baseUrl.getUrl();
    return {
      fetchAllSubject: function(token) {
        return $http.get(url + '/admin/subject_mgmt/' + token);
      },
      findSubject: function(id, token) {
        return $http.get(url + '/admin/subject_mgmt/find/' + token + '/' + id);
      },
      findThemeBySubject: function(id, token) {
        return $http.get(url + '/admin/subject_mgmt/findThemeBySubject/' + token + '/' + id);
      },

      createSubject: function(params) {
        return $http.post(url + '/admin/subject_mgmt/create/', params);
      },

      updateSubject: function(subject) {
        return $http.put(url + '/admin/subject_mgmt/update/', subject);
      },
      deleteSubject: function(id, token) {
        return $http.delete(url + '/admin/subject_mgmt/delete/' + token + '/' + id);
      },
      importSubject: function(params) {
        return $http.post(url + '/admin/subject_mgmt/import/', params);
      },
      createChapter: function(params) {
        return $http.post(url + '/teacher/subMateriMgmt/create/', params);
      },
      updateChapter: function(params) {
        return $http.put(url + '/teacher/subMateriMgmt/update/', params);
      },
      deleteChapter: function(id, token) {
        return $http.delete(url + '/teacher/subMateriMgmt/delete/' + token + '/' + id);
      },
      fetchAllChapter: function(teacherId, token) {
        return $http.get(url + '/teacher/subMateriMgmt/' + token + '/' + teacherId);
      },
      findChapter: function(chapterId, token) {
        return $http.get(url + '/teacher/subMateriMgmt/findTagById/' + token + '/' + chapterId);
      }
    };

  }]);
