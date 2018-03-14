(function() {

    'use strict';
    angular.module('app').factory('classService', classService);

    classService.$inject = ['$http', 'baseUrl'];

    function classService($http, baseUrl) {
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
    }

})();
(function() {

    'use strict';
    angular.module('app').factory('teacherService', teacherService);

    teacherService.$inject = ['$http', 'baseUrl'];

    function teacherService($http, baseUrl) {
        var url = baseUrl.getUrl();
        return {

            fetchAllTeacher: function(token) {
                return $http.get(url + '/admin/teacher_mgmt/' + token);
            },

            findTeacher: function(nip, token) {
                return $http.get(url + '/admin/teacher_mgmt/find/' + token + '/' + nip);
            },

            createTeacher: function(params) {
                return $http.post(url + '/admin/teacher_mgmt/create/', params);
            },

            importTeacher: function(params) {
                return $http.post(url + '/admin/teacher_mgmt/import/', params);
            },

            updateTeacher: function(params) {
                return $http.put(url + '/admin/teacher_mgmt/update/', params);
            },

            deleteTeacher: function(nip, token) {
                return $http.delete(url + '/admin/teacher_mgmt/delete/' + token + '/' + nip);
            }
        };

    }

})();
(function() {

    'use strict';
    angular.module('app').factory('studentService', studentService);

    studentService.$inject = ['$http', 'baseUrl'];

    function studentService($http, baseUrl) {
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
    }


})();
(function() {

    'use strict';
    angular.module('app').factory('subjectService', subjectService);

    subjectService.$inject = ['$http', 'baseUrl'];

    function subjectService($http, baseUrl) {
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
            },
            fetchAllChapterByTeachIdAndSubjectId: function(teacherId, token, subjectId) {
                return $http.get(url + '/teacher/subMateriMgmt/findTagBySubject/' + token + '/' + teacherId + '/' + subjectId);
            },
        };

    }


})();
(function() {

    'use strict';
    angular.module('app').factory('schoolProfileService', schoolProfileService);

    schoolProfileService.$inject = ['$http', 'baseUrl'];

    function schoolProfileService($http, baseUrl) {
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
(function() {

    'use strict';
    angular.module('app').factory('licenseService', licenseService);

    licenseService.$inject = ['$http', 'baseUrl'];

    function licenseService($http, baseUrl) {
        var url = baseUrl.getUrl();
        var remoteUrl = baseUrl.getRemote();
        return {

            saveLicense: function(license, token) {
                var params = [{
                    'authorization': token,
                    'license': license,
                    'activationKey': "",
                    'registerDate': new Date().getTime()
                }];
                return $http.post(url + '/admin/license/create/', params);
            },
            fetchAllLicense: function(token) {
                return $http.get(url + '/admin/license/' + token);
            },
            deleteLicense: function(id, token) {
                return $http.delete(url + '/admin/license/delete/' + token + '/' + id);
            },
            activateByInternet: function(obj, token) {

                var license = {
                    "id": obj.id,
                    "license": obj.license,
                    "passKey": obj.passKey,
                    "activationKey": obj.activationKey,
                    "createdDate": obj.createdDate,
                    "xlock": obj.xlock,
                    "macAddr": obj.macAddr,
                    "numberOfClient": obj.numberOfClient,
                    "licenseStatus": obj.licenseStatus
                }

                return $http.post(url + '/admin/license/activateByInternet/', [{ authorization: token, license: license }]);

            },

            manualActivation: function(obj, token) {
                var license = {
                    "id": obj.id,
                    "license": obj.license,
                    "passKey": obj.passKey,
                    "activationKey": obj.activationKey,
                    "createdDate": obj.createdDate,
                    "xlock": obj.xlock,
                    "macAddr": obj.macAddr,
                    "numberOfClient": obj.numberOfClient,
                    "licenseStatus": obj.licenseStatus
                }

                return $http.post(url + '/admin/license/activate/', [{ authorization: token, license: license }]);

            }

        };
    }

})();
(function() {

    'use strict';
    angular.module('app').factory('activeUserService', activeUserService);

    activeUserService.$inject = ['$http', 'baseUrl'];

    function activeUserService($http, baseUrl) {
        var url = baseUrl.getUrl();
        return {
            fetchAllActiveUser: function(token) {
                return $http.get(url + '/admin/activeUser/' + token);
            },
            deleteActiveUser: function(id, token) {
                return $http.delete(url + '/admin/activeUser/delete/' + token + '/' + id);
            },
        };
    }
})();
(function() {

    'use strict';
    angular.module('app').factory('forgotPassService', forgotPassService);

    forgotPassService.$inject = ['$http', 'baseUrl'];

    function forgotPassService($http, baseUrl) {
        var url = baseUrl.getUrl();
        return {
            findByNisOrNip: function(token, value) {
                return $http.get(url + '/forgotPass/forgot/' + token + '/' + value);
            },
        };
    }

})();
(function() {
    'use strict';
    angular.module('app')
        .factory('eventService', eventService);

    eventService.$inject = ['$http', 'baseUrl'];

    function eventService($http, baseUrl) {
        var url = baseUrl.getUrl();
        return {
            saveEvent: function(selectedEvent, token) {
                var params = [{
                    'authorization': token,
                    'event': selectedEvent
                }];
                return $http.post(url + '/teacher/teacher_event_mgmt/create/', params);
            },

            updateEvent: function(selectedEvent, token) {
                var params = [{
                    'authorization': token,
                    'event': selectedEvent
                }];
                return $http.put(url + '/teacher/teacher_event_mgmt/update/', params);
            },

            fetchAllEvent: function(token, nip) {
                return $http.get(url + '/teacher/teacher_event_mgmt/' + token + '/' + nip);
            },
            findEvent: function(eventId, token) {
                return $http.get(url + '/teacher/teacher_event_mgmt/detail/' + token + '/' + eventId);
            },
            fetchEventResult: function(eventId, token) {
                return $http.get(url + '/teacher/teacher_event_mgmt/list_event_result/' + token + '/' + eventId + '/' + 0);
            },
            fetchEventStudents: function(token, eventId) {
                return $http.get(url + '/teacher/teacher_event_mgmt/getStudentEvent/' + token + '/' + eventId);
            },
            fetchDetailStudentExamine: function(token, eventId, nis) {
                return $http.get(url + '/teacher/teacher_event_mgmt/getDetailStudentExamineScore/' + token + '/' + eventId + '/' + nis);
            },
            saveEventResult: function(token, eventId, nis, listEssay) {
                var params = [{
                    'authorization': token,
                    'studentResult': {
                        'eventId': eventId,
                        'nis': nis,
                        'listEssay': listEssay
                    }
                }];

                return $http.post(url + '/teacher/teacher_event_mgmt/saveEventResult/', params);
            },
            setEventComplete: function(token, eventId) {
                var params = [{
                    'authorization': token,
                    'eventId': eventId
                }];
                return $http.post(url + '/teacher/teacher_event_mgmt/completedEvent/', params);
            }
        };
    }
})();
(function() {

    'use strict';
    angular.module('app').factory('queastionBankService', queastionBankService);

    queastionBankService.$inject = ['$http', 'baseUrl'];

    function queastionBankService($http, baseUrl) {
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

            importQuestionBankTemp: function(questionBanks, token) {
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
                    'questionGroup': questionGroup,
                    'questionGroupName': questionGroup.questionGroupName
                }];
                return $http.post(url + '/teacher/questionMgmt/createQuestion/', params);
            },

            updateQuestionGroup: function(token, questionGroup) {
                var params = [{
                    'authorization': token,
                    'questionGroup': questionGroup,
                    'questionGroupName': questionGroup.questionGroupName
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

                var params = [{
                    'authorization': token,
                    'questionGroupId': questionGroupId,
                    'images': qImages
                }];
                var uploadUrl = url + "/user/upload/uploadImgQuestion/";
                var result = $http.post(uploadUrl, params);
                return result;
            },
            deleteImage: function(token, imageId) {
                $http.delete(url + '/user/upload/deleteImgQuestion/' + token + '/' + imageId);
            }

        };
    }

})();
(function() {

    'use strict';
    angular.module('app').factory('taskService', taskService);

    taskService.$inject = ['$http', 'baseUrl'];

    function taskService($http, baseUrl) {
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
    }

})();
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
(function() {

    'use strict';
    loginService.$inject = ["$http", "baseUrl"];
    angular.module('app').factory('loginService', loginService);

    loginService = ['$http', 'baseUrl'];

    function loginService($http, baseUrl) {
        var url = baseUrl.getUrl();
        return {

            loggingIn: function(user) {
                var users = [];
                users.push(user);
                return $http.post(url + '/user/authorization/loggingIn/', users);
            },
            createAdmin: function() {
                return $http.post(url + '/admin/adminMgmt/createAdmin/');
            },
            closeHandle: function(params) {
                return $http.post(url + '/user/closeHandle/forcedLogOut/', params);
            },
            isImport: function() {
                return $http.post(url + "/user/authorization/isImport/");
            },
            import: function() {
                return $http.post(url + "/user/authorization/import/");
            }


        };

    }
})();
(function() {
    'use strict';
    angular.module('app').factory('changePswdService', changePswdService);

    changePswdService.$inject = ['$http', 'baseUrl'];

    function changePswdService($http, baseUrl) {
        var url = baseUrl.getUrl();
        return {
            updatePassword: function(data, token, userName) {
                var params = [{
                    'authorization': token,
                    'password': data,
                    'userName': userName
                }];

                return $http.post(url + '/user/changePass/update/', params);
            }
        };
    }
})();