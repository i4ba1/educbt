(function() {
    'use strict';

    angular
        .module('app')
        .factory('SchoolProfileService', SchoolProfileService);

    SchoolProfileService.$inject = ['$http', 'baseUrl'];

    function SchoolProfileService($http, baseUrl) {
        var url = baseUrl.getUrl();
        return {
            saveOrUpdateProfile: function(profile, isUpdate, token) {
                var uploadUrl = "";
                var fd = new FormData();
                fd.append('token', token);
                fd.append('file', profile.file);
                fd.append('schoolName', profile.schoolName);
                fd.append('schoolDescription', profile.schoolDescription);
                if (isUpdate) {
                    fd.append('id', profile.id);
                    uploadUrl = url + '/admin/schoolMgmt/updateSchoolProfile/';

                } else {
                    uploadUrl = url + '/admin/schoolMgmt/saveSchoolProfile/';
                }
                var result = $http.post(uploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                });
                return result;
            },
            fetchProfile: function(token) {
                return $http.get(url + '/admin/schoolMgmt/findSchoolProfile/' + token);
            }
        };
    }
})();