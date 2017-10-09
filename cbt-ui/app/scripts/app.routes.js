(function() {

    'use strict';

    angular.module('app').config(config);

    // Route Configuration for Administrator
    function config($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('checkroute', {
                url: '/',
                views: {
                    '': {
                        template: '',
                        controller: function(storageService) {
                            storageService.isUserExistThenRedirectTo();
                        }
                    }
                }
            })
            .state('admin', {
                url: '/admin',
                views: {
                    '': {
                        templateUrl: 'views/admin/admin-home.html',
                        controller: 'LogoutController as logoutCtrl'
                    },
                    'content@admin': {
                        templateUrl: 'views/admin/dashboard/dashboard.html',
                        controller: 'DashboardController as dashboardCtrl'
                    }
                }
            })
            .state('admin.teacherMgmt', {
                url: '/teacher-management',
                views: {
                    'content@admin': {
                        templateUrl: 'views/admin/teacher/teacher-list.html',
                        controller: 'TeacherController as teacherCtrl'
                    }
                }
            })
            .state('admin.teacherMgmt.teacherDetail', {
                url: '/teacher-detail/:teacherNip',
                views: {
                    'content@admin': {
                        templateUrl: 'views/admin/teacher/teacher-detail.html',
                        controller: 'TeacherController as teacherCtrl'
                    }
                }
            })
            .state('admin.classMgmt', {
                url: '/class-management',
                views: {
                    'content@admin': {
                        templateUrl: 'views/admin/class/class-list.html',
                        controller: 'ClassController as classCtrl'
                    }
                }
            })
            .state('admin.classMgmt.classDetail', {
                url: '/class-detail/:classId',
                views: {
                    'content@admin': {
                        templateUrl: 'views/admin/class/class-detail.html',
                        controller: 'ClassController as classCtrl'
                    }
                }
            })
            .state('admin.teacherImport', {
                url: '/teacher-import',
                views: {
                    'content@admin': {
                        templateUrl: 'views/admin/teacher/teacher-import.html',
                        controller: 'TeacherController as teacherCtrl'
                    }
                }
            })
            .state('admin.subjectImport', {
                url: '/subject-import',
                views: {
                    'content@admin': {
                        templateUrl: 'views/admin/subject/subject-import.html',
                        controller: 'SubjectController as subjectCtrl'
                    }
                }
            })
            .state('admin.classImport', {
                url: '/class-import',
                views: {
                    'content@admin': {
                        templateUrl: 'views/admin/class/class-import.html',
                        controller: 'ClassController as classCtrl'
                    }
                }
            })
            .state('admin.studentMgmt', {
                url: '/student-management',
                views: {
                    'content@admin': {
                        templateUrl: 'views/admin/student/student-list.html',
                        controller: 'StudentController as studentCtrl'
                    }
                }
            })
            .state('admin.studentMgmt.studentDetail', {
                url: '/student-detail/:studentNis',
                views: {
                    'content@admin': {
                        templateUrl: 'views/admin/student/student-detail.html',
                        controller: 'StudentController as studentCtrl'
                    }
                }

            })
            .state('admin.studentImport', {
                url: '/student-import',
                views: {
                    'content@admin': {
                        templateUrl: 'views/admin/student/student-import.html',
                        controller: 'StudentController as studentCtrl'
                    }
                }
            })
            .state('admin.setting', {
                url: '/profile-setting',
                views: {
                    'content@admin': {
                        templateUrl: 'views/admin/settings/school-profile/school-profile.html',
                        controller: 'SchoolProfileController as schoolProfileCtrl'
                    }
                }
            })
            .state('admin.subjectMgmt', {
                url: '/subject-management',
                views: {
                    'content@admin': {
                        templateUrl: 'views/admin/subject/subject-list.html',
                        controller: 'SubjectController as subjectCtrl'
                    }
                }
            })
            .state('admin.subjectMgmt.subjectDetail', {
                url: '/subject-detail/:subjectId',
                views: {
                    'content@admin': {
                        templateUrl: 'views/admin/subject/subject-detail.html',
                        controller: 'SubjectController as subjectCtrl'
                    }
                }
            })
            .state('login', {
                url: '/login',
                views: {
                    '': {
                        templateUrl: 'views/login/login.html',
                        controller: 'LoginController as loginCtrl'
                    }
                }
            })
            .state('admin.forgotPswd', {
                url: '/forgot-paswd',
                views: {
                    'content@admin': {
                        templateUrl: 'views/admin/settings/forgot-password/forgot-password.html',
                        controller: 'ForgotPasswordController as forgotPswdCtrl'
                    }
                }
            })
            .state('admin.licenseMgmt', {
                url: '/license-mgmt',
                views: {
                    'content@admin': {
                        templateUrl: 'views/admin/license/license-list.html',
                        controller: 'LicenseController as licenseCtrl'
                    }
                }
            })
            .state('admin.licenseMgmt.create', {
                url: '/create-:paramUrl',
                params: {
                    license: null
                },
                views: {
                    'content@admin': {
                        templateUrl: 'views/admin/license/license-detail.html',
                        controller: 'LicenseController as licenseCtrl'
                    }
                }
            })
            .state('admin.activeUser', {
                url: '/active-user',
                views: {
                    'content@admin': {
                        templateUrl: 'views/admin/settings/active-user/active-user.html',
                        controller: 'ActiveUserController as activeUserCtrl'
                    }
                }
            })
            .state('admin.changePswd', {
                url: '/change-pswd',
                views: {
                    'content@admin': {
                        templateUrl: 'views/change-password/change-password.html',
                        controller: 'ChangePasswordController as changePswdCtrl'
                    }
                }
            });
    }

})();