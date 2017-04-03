'use strict';

angular
    .module('app.routes', ['ui.router'])
    .config(config);

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
                    templateUrl: 'sections/admin/admin.home.html',
                    controller: 'LogoutController as logoutCtrl'
                },
                'content@admin': {
                    templateUrl: 'sections/admin/dashboard/dashboard.html',
                    controller: 'DashboardController as dashboardCtrl'
                }
            }
        })
        .state('admin.teacherMgmt', {
            url: '/teacher-management',
            views: {
                'content@admin': {
                    templateUrl: 'sections/admin/teacher/teacher.list.html',
                    controller: 'TeacherController as teacherCtrl'
                }
            }
        })
        .state('admin.teacherMgmt.teacherDetail', {
            url: '/teacher-detail/:teacherNip',
            views: {
                'content@admin': {
                    templateUrl: 'sections/admin/teacher/teacher.detail.html',
                    controller: 'TeacherController as teacherCtrl'
                }
            }
        })
        .state('admin.classMgmt', {
            url: '/class-management',
            views: {
                'content@admin': {
                    templateUrl: 'sections/admin/class/class.list.html',
                    controller: 'ClassController as classCtrl'
                }
            }
        })
        .state('admin.classMgmt.classDetail', {
            url: '/class-detail/:classId',
            views: {
                'content@admin': {
                    templateUrl: 'sections/admin/class/class.detail.html',
                    controller: 'ClassController as classCtrl'
                }
            }
        })
        .state('admin.teacherImport', {
            url: '/teacher-import',
            views: {
                'content@admin': {
                    templateUrl: 'sections/admin/teacher-import/teacher.import.html',
                    controller: 'TeacherController as teacherCtrl'
                }
            }
        })
        .state('admin.subjectImport', {
            url: '/subject-import',
            views: {
                'content@admin': {
                    templateUrl: 'sections/admin/subject-import/subject.import.html',
                    controller: 'SubjectController as subjectCtrl'
                }
            }
        })
        .state('admin.classImport', {
            url: '/class-import',
            views: {
                'content@admin': {
                    templateUrl: 'sections/admin/class-import/class.import.html',
                    controller: 'ClassController as classCtrl'
                }
            }
        })
        .state('admin.studentMgmt', {
            url: '/student-management',
            views: {
                'content@admin': {
                    templateUrl: 'sections/admin/student/student.list.html',
                    controller: 'StudentController as studentCtrl'
                }
            }
        })
        .state('admin.studentMgmt.studentDetail', {
            url: '/student-detail/:studentNis',
            views: {
                'content@admin': {
                    templateUrl: 'sections/admin/student/student.detail.html',
                    controller: 'StudentController as studentCtrl'
                }
            }

        })
        .state('admin.studentImport', {
            url: '/student-import',
            views: {
                'content@admin': {
                    templateUrl: 'sections/admin/student-import/student.import.html',
                    controller: 'StudentController as studentCtrl'
                }
            }
        })
        .state('admin.setting', {
            url: '/profile-setting',
            views: {
                'content@admin': {
                    templateUrl: 'sections/admin/settings/school-profile/school.profile.setting.html',
                    controller: 'SchoolProfileController as schoolProfileCtrl'
                }
            }
        })
        .state('admin.subjectMgmt', {
            url: '/subject-management',
            views: {
                'content@admin': {
                    templateUrl: 'sections/admin/subject/subject.list.html',
                    controller: 'SubjectController as subjectCtrl'
                }
            }
        })
        .state('admin.subjectMgmt.subjectDetail', {
            url: '/subject-detail/:subjectId',
            views: {
                'content@admin': {
                    templateUrl: 'sections/admin/subject/subject.detail.html',
                    controller: 'SubjectController as subjectCtrl'
                }
            }
        })
        .state('login', {
            url: '/login',
            views: {
                '': {
                    templateUrl: 'sections/login/login.html',
                    controller: 'LoginController as loginCtrl'
                }
            }
        })
        .state('admin.forgotPswd', {
            url: '/forgot-paswd',
            views: {
                'content@admin': {
                    templateUrl: 'sections/admin/settings/forgot-pswd/forgot.paswd.html',
                    controller: 'ForgotPasswordController as forgotPswdCtrl'
                }
            }
        })
        .state('admin.licenseMgmt', {
            url: '/license-mgmt',
            views: {
                'content@admin': {
                    templateUrl: 'sections/admin/license/license.list.html',
                    controller: 'LicenseController as licenseCtrl'
                }
            }
        })
        .state('admin.licenseMgmt.create', {
            url: '/create',
            views: {
                'content@admin': {
                    templateUrl: 'sections/admin/license/license.add.html',
                    controller: 'LicenseController as licenseCtrl'
                }
            }
        })
        .state('admin.activeUser', {
            url: '/active-user',
            views: {
                'content@admin': {
                    templateUrl: 'sections/admin/settings/active-user/active.user.list.html',
                    controller: 'ActiveUserController as activeUserCtrl'
                }
            }
        })
        .state('admin.changePswd', {
            url: '/change-pswd',
            views: {
                'content@admin': {
                    templateUrl: 'sections/change-password/change.pswd.html',
                    controller: 'ChangePasswordController as changePswdCtrl'
                }
            }
        });
}