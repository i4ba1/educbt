(function() {
    'use strict';

    angular.module('app')
        .config(config);

    // Route Configuration for Teacher
    function config($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('teacher', {
                url: '/teacher',
                views: {
                    '': {
                        templateUrl: 'views/teacher/teacher-home.html',
                        controller: 'LogoutController as logoutCtrl'
                    },
                    'content@teacher': {
                        templateUrl: 'views/teacher/teacher-dashboard/teacher-dashboard.html',
                        controller: 'TeacherDashboardController as teacherDashboardCtrl'
                    }
                }
            })
            .state('teacher.eventManagement', {
                url: '/event',
                views: {
                    'content@teacher': {
                        templateUrl: 'views/teacher/event/event-list.html',
                        controller: 'EventManagementController as eventCtrl'
                    }
                }
            })
            .state('teacher.eventManagement.create', {
                url: '/create',
                views: {
                    'content@teacher': {
                        templateUrl: 'views/teacher/event/event-create.html',
                        controller: 'EventManagementController as eventCtrl'
                    }
                }
            })
            .state('teacher.eventManagement.update', {
                url: '/update/:eventId',
                views: {
                    'content@teacher': {
                        templateUrl: 'views/teacher/event/event-create.html',
                        controller: 'EventManagementController as eventCtrl'
                    }
                }
            })
            .state('teacher.eventManagement.result', {
                url: '/event-result/:eventId',
                views: {
                    'content@teacher': {
                        templateUrl: 'views/teacher/event/event-result.html',
                        controller: 'EventManagementController as eventCtrl'
                    }
                }
            })
            .state('teacher.eventManagement.detail.classDetail', {
                url: '/:className',
                views: {
                    'content@teacher': {
                        templateUrl: 'views/teacher/event/event-detail-class.html',
                        controller: 'EventManagementController as eventCtrl'
                    }
                }
            })
            .state('teacher.questionBank', {
                url: '/question-bank',
                views: {
                    'content@teacher': {
                        templateUrl: 'views/teacher/question-bank/question-bank-list.html',
                        controller: 'QuestionsBankController as qstBankCtrl'
                    }
                }
            })
            .state('teacher.questionBank.create', {
                url: '/create-or-update/:questionBankId',
                views: {
                    'content@teacher': {
                        templateUrl: 'views/teacher/question-bank/question-bank-create.html',
                        controller: 'QuestionsBankController as qstBankCtrl'
                    }
                }
            })
            .state('teacher.questionBank.qpdetail.import', {
                url: '/import',
                views: {
                    'content@teacher': {
                        templateUrl: 'views/teacher/question-bank-import/question-bank-import.html',
                        controller: 'QuestionBankImportController as importCtrl'
                    }
                }
            })
            .state('teacher.questionBank.qpdetail', {
                url: '/question-pool/:questionBankId',
                views: {
                    'content@teacher': {
                        templateUrl: 'views/teacher/question-bank/question-bank-detail.html',
                        controller: 'QuestionsBankController as qstBankCtrl'
                    }
                }
            })
            .state('teacher.questionBank.qpdetail.qCreateOrUpdate', {
                url: '/create-or-update/:subjectId/:qType/:qId',
                views: {
                    'content@teacher': {
                        templateUrl: 'views/teacher/question/question.html',
                        controller: 'QuestionController as qstCtrl'
                    }
                }
            })
            .state('teacher.accountSetting', {
                url: '/account-setting',
                views: {
                    'content@teacher': {
                        templateUrl: 'views/teacher/teacher-account-setting/teacher-account-setting.html',
                        controller: 'TeacherAccountSetting as accountSettingCtrl'
                    }
                }
            })
            .state('teacher.changePswd', {
                url: '/change-pswd',
                views: {
                    'content@teacher': {
                        templateUrl: 'views/change-password/change-password.html',
                        controller: 'ChangePasswordController as changePswdCtrl'
                    }
                }
            })
            .state('teacher.chapter', {
                url: '/chapters',
                views: {
                    'content@teacher': {
                        templateUrl: 'views/teacher/sub-subject/sub-subject-list.html',
                        controller: 'ChapterController as chapterCtrl'
                    }
                }
            })
            .state('teacher.chapter.createOrUpdate', {
                url: '/create-or-update/:chapterId',
                views: {
                    'content@teacher': {
                        templateUrl: 'views/teacher/sub-subject/sub-subject-detail.html',
                        controller: 'ChapterController as chapterCtrl'
                    }
                }
            });
    }

})();