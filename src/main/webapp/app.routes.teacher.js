(function() {
    'use strict';

    angular.module('app.routes.teacher', ['ui.router'])
        .config(config);

    function config($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('teacher', {
                url: '/teacher',
                views: {
                    '': {
                        templateUrl: 'sections/teacher/teacher.home.html',
                        controller: 'LogoutController as logoutCtrl'
                    },
                    'content@teacher': {
                        templateUrl: 'sections/teacher/dashboard/dashboard.html',
                        controller: 'TeacherDashboardController as teacherDashboardCtrl'
                    }
                }
            })
            .state('teacher.eventManagement', {
                url: '/event',
                views: {
                    'content@teacher': {
                        templateUrl: 'sections/teacher/event/event.html',
                        controller: 'EventManagementController as eventCtrl'
                    }
                }
            })
            .state('teacher.eventManagement.create', {
                url: '/create',
                views: {
                    'content@teacher': {
                        templateUrl: 'sections/teacher/event/create/event.create.html',
                        controller: 'EventManagementController as eventCtrl'
                    }
                }
            })
            .state('teacher.eventManagement.update', {
                url: '/update/:eventId',
                views: {
                    'content@teacher': {
                        templateUrl: 'sections/teacher/event/create/event.create.html',
                        controller: 'EventManagementController as eventCtrl'
                    }
                }
            })
            .state('teacher.eventManagement.result', {
                url: '/event-result/:eventId',
                views: {
                    'content@teacher': {
                        templateUrl: 'sections/teacher/event/result/event.result.html',
                        controller: 'EventManagementController as eventCtrl'
                    }
                }
            })
            .state('teacher.eventManagement.detail.classDetail', {
                url: '/:className',
                views: {
                    'content@teacher': {
                        templateUrl: 'sections/teacher/event/detail/class-detail/event.detail.class.html',
                        controller: 'EventManagementController as eventCtrl'
                    }
                }
            })
            .state('teacher.questionBank', {
                url: '/question-bank',
                views: {
                    'content@teacher': {
                        templateUrl: 'sections/teacher/question-bank/question.bank.html',
                        controller: 'QuestionsBankController as qstBankCtrl'
                    }
                }
            })
            .state('teacher.questionBank.create', {
                url: '/create-or-update/:questionBankId',
                views: {
                    'content@teacher': {
                        templateUrl: 'sections/teacher/question-bank/question.bank.create.html',
                        controller: 'QuestionsBankController as qstBankCtrl'
                    }
                }
            })
            .state('teacher.questionBank.qpdetail.import', {
                url: '/import',
                views: {
                    'content@teacher': {
                        templateUrl: 'sections/teacher/question-bank/question-import/question.bank.import.html',
                        controller: 'QuestionBankImportController as importCtrl'
                    }
                }
            })
            .state('teacher.questionBank.qpdetail', {
                url: '/question-pool/:questionBankId',
                views: {
                    'content@teacher': {
                        templateUrl: 'sections/teacher/question-bank/question.bank.detail.html',
                        controller: 'QuestionsBankController as qstBankCtrl'
                    }
                }
            })
            .state('teacher.questionBank.qpdetail.qCreateOrUpdate', {
                url: '/create-or-update/:subjectId/:qType/:qId',
                views: {
                    'content@teacher': {
                        templateUrl: 'sections/teacher/question-bank/question/question.html',
                        controller: 'QuestionController as qstCtrl'
                    }
                }
            })
            .state('teacher.accountSetting', {
                url: '/account-setting',
                views: {
                    'content@teacher': {
                        templateUrl: 'sections/teacher/settings/account.setting.html',
                        controller: 'TeacherAccountSetting as accountSettingCtrl'
                    }
                }
            })
            .state('teacher.changePswd', {
                url: '/change-pswd',
                views: {
                    'content@teacher': {
                        templateUrl: 'sections/change-password/change.pswd.html',
                        controller: 'ChangePasswordController as changePswdCtrl'
                    }
                }
            })
            .state('teacher.chapter', {
                url: '/chapters',
                views: {
                    'content@teacher': {
                        templateUrl: 'sections/teacher/chapter/chapter.list.html',
                        controller: 'ChapterController as chapterCtrl'
                    }
                }
            })
            .state('teacher.chapter.createOrUpdate', {
                url: '/create-or-update/:chapterId',
                views: {
                    'content@teacher': {
                        templateUrl: 'sections/teacher/chapter/chapter.detail.html',
                        controller: 'ChapterController as chapterCtrl'
                    }
                }
            });
    }

})();