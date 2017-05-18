(function() {
    'use strict';

    angular
        .module('app.routes.student', ['ui.router'])
        .config(config);

    function config($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('student', {
                url: '/student',
                views: {
                    '': {
                        templateUrl: 'sections/student/student.home.html',
                        controller: 'LogoutController as logoutCtrl'
                    },
                    'content@student': {
                        templateUrl: 'sections/student/dashboard/dashboard.html',
                        controller: 'StudentDashboardController as stdDsbCtrl'
                    }
                }
            })
            .state('student.task', {
                url: '/task/:eventType',
                views: {
                    'content@student': {
                        templateUrl: 'sections/student/student-task/student.task.html',
                        controller: 'StudentTaskController as taskCtrl'
                    }
                }
            })
            .state('student.task.exam', {
                url: '/exam/:eventId',
                views: {
                    'content@student': {
                        templateUrl: 'sections/student/student-exam/student.exam.working.html',
                        controller: 'StudentExamController as studentExamController'
                    }
                }
            })
            .state('student.task.explanation', {
                url: '/explanation/:eventId',
                views: {
                    'content@student': {
                        templateUrl: 'sections/student/student-exam/student.exam.working.html',
                        controller: 'StudentExamController as studentExamController'
                    }
                }
            })
            .state('student.task.exam.result', {
                url: '/result/',
                views: {
                    'content@student': {
                        templateUrl: 'sections/student/student-exam/student-exam-result/student.exam.result.html',
                        controller: 'ExamResultController as examResultController'
                    }
                }
            })
            .state('student.changePswd', {
                url: '/change-pswd',
                views: {
                    'content@student': {
                        templateUrl: 'sections/change-password/change.pswd.html',
                        controller: 'ChangePasswordController as changePswdCtrl'
                    }
                }
            });
    }

})();