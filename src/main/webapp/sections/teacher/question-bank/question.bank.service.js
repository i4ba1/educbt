angular.module('app.core')
    .factory('queastionBankService', ['$http', '$q', 'baseUrl', function($http, $q, baseUrl) {
        var url = baseUrl.getUrl();
        return {
            fetchAllQuestionBank: function(token, nip) {
                return $http.get(url + '/teacher/questionMgmt/' + token + '/' + nip);
            },

            findQuestionBank: function(id, token, nip) {
                return $http.get(url + '/teacher/questionMgmt/findQP/' + token + '/' + id);
            },

            fetchAllQuestionBySubject: function(subjectId, token, nip) {
                return $http.get(url + '/teacher/questionMgmt/findQBySubject/' + token + '/' + subjectId + '/' + nip);
            },

            fetchAllQuestion: function(qpId, token) {
                return $http.get(url + '/teacher/questionMgmt/listQuestionInQP/' + token + '/' + qpId);
            },

            importQuestionBank: function(questionBanks, token) {
                var params = [{
                    'authorization': token,
                    'questionBank': questionBanks
                }];
                return $http.post(url + '/teacher/questionMgmt/create/', params);
            },

            findQuestion: function(questionId, token) {
                return $http.get(url + '/teacher/questionMgmt/findQ/' + token + '/' + questionId);
            },

            deleteQuestion: function(questionId, token) {
                return $http.delete(url + '/teacher/questionMgmt/deleteQ/' + token + '/' + questionId);
            },

            deleteQuestionBank: function(questionBankId, token) {
                return $http.delete(url + '/teacher/questionMgmt/delete/' + token + '/' + questionBankId);
            },

            updateQuestionBank: function(questionBank, token) {
                var params = [{
                    'authorization': token,
                    'questionBank': questionBank
                }];
                return $http.put(url + '/teacher/questionMgmt/update/', params);
            },

            updateQuestion: function(question, token) {
                var params = [{
                    'authorization': token,
                    'question': question
                }];
                return $http.put(url + '/teacher/questionMgmt/updateQ/', params);
            },

            fetchQuestionByEventId: function(eventId, token) {
                return $http.get(url + '/teacher/teacher_event_mgmt/findQuestionByEventId/' + token + '/' + eventId);
            },

            createQuestionPool: function(token, questionBank) {
                var params = [{
                    'authorization': token,
                    'questionBank': questionBank.questionPoolName,
                    'subjectId': questionBank.subject.id,
                    'teacherId': questionBank.teacherId
                }];
                return $http.post(url + '/teacher/questionMgmt/createQuestionPool/', params);
            },

            detailQuestionPool: function(id, token, nip) {
                return $http.get(url + '/teacher/questionMgmt/detailQuestionPool/' + token + '/' + id + '/' + nip);
            },

            detailQuestionGroup: function(id, token) {
                return $http.get(url + '/teacher/questionMgmt/detailQuestionGroup/' + token + '/' + id);
            },

            createQuestionGroup: function(token, questionGroup) {
                var params = [{
                    'authorization': token,
                    'questionGroup': questionGroup
                }];
                return $http.post(url + '/teacher/questionMgmt/createQuestion/', params);
            },

            updateQuestionGroup: function(token, questionGroup) {
                var params = [{
                    'authorization': token,
                    'questionGroup': questionGroup
                }];
                return $http.put(url + '/teacher/questionMgmt/updateQ/', params);
            },

            deleteQuestionGroup: function(id, token) {
                return $http.delete(url + '/teacher/questionMgmt/deleteQG/' + token + '/' + id);
            },

            uploadImage: function(token, file, nip) {
                var uploadUrl = "";
                var fd = new FormData();
                fd.append('token', token);
                fd.append('file', file);
                fd.append('teacherNip', nip);
                uploadUrl = url + '/user/upload/uploadImgQuestion/';
                var result = $http.post(uploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                });
                return result;
            },

            findAllGallery: function(token, nip) {
                return $http.get(url + '/user/upload/findAllTeacherGallery/' + token + '/' + nip);
            },

            importQuestionBank: function(token, file, importModel) {

                var fd = new FormData();
                fd.append('token', token);
                fd.append('questionFile', file);
                fd.append('questionPoolId', importModel.questionPoolId);
                fd.append('questionGroupType', importModel.questionGroupType);
                fd.append('passage', importModel.passage);
                var uploadUrl = url + "/teacher/questionMgmt/importQuestion/";
                var result = $http.post(uploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                })

                return result;

            },
            filterQuestionByTagNames: function(token, tagIds) {
                var fd = new FormData();
                fd.append('token', token);
                fd.append('tagIds', tagIds);
                var uploadUrl = url + "/teacher/questionMgmt/filterQuestionByTag/";
                var result = $http.post(uploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                })
                return result;
            },
            uploadImages: function(token, questionGroupId, qImages) {
                /*var fd = new FormData();
                fd.append('token', token);
                fd.append('questionGroupId', questionGroupId);
                fd.append('images', qImages);
                */
                var params = [{
                    'authorization': token,
                    'questionGroupId': questionGroupId,
                    'images': qImages
                }];
                var uploadUrl = url + "/user/upload/uploadImgQuestion/";
                var result = $http.post(uploadUrl, params);
                return result;
            }

        };
    }]);