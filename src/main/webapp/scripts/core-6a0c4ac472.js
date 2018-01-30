/*! angular-csv-import - v0.0.26 - 2015-11-11
 * Copyright (c) 2015 ; Licensed  */
'use strict';

var csvImport = angular.module('ngCsvImport', []);

csvImport.directive('ngCsvImport', function() {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: {
      content: '=?',
      header: '=?',
      headerVisible: '=?',
      separator: '=?',
      separatorVisible: '=?',
      result: '=?',
      encoding: '=?',
      encodingVisible: '=?',
      accept: '=?'
    },
    template: '<div>' +
      '<div ng-show="headerVisible"><div class="label">Header</div><input type="checkbox" ng-model="header"></div>' +
      '<div ng-show="encoding && encodingVisible"><div class="label">Encoding</div><span>{{encoding}}</span></div>' +
      '<div ng-show="separator && separatorVisible">' +
      '<div class="label">Seperator</div>' +
      '<span><input class="separator-input" type="text" ng-change="changeSeparator" ng-model="separator"><span>' +
      '</div>' +
      '<div><input name="inputFile" type="file" multiple accept="{{accept}}"/></div>' +
      '</div>',
    link: function(scope, element) {
      scope.separatorVisible = scope.separatorVisible || false;
      scope.headerVisible = scope.headerVisible || false;

      angular.element(element[0].querySelector('.separator-input')).on('keyup', function(e) {
        if (scope.content != null) {
          var content = {
            csv: scope.content,
            header: scope.header,
            separator: e.target.value,
            encoding: scope.encoding
          };
          scope.result = csvToJSON(content);
          scope.$apply();
        }
      });

      element.on('change', function(onChangeEvent) {
        var reader = new FileReader();
        scope.filename = onChangeEvent.target.files[0].name;
        reader.onload = function(onLoadEvent) {
          scope.$apply(function() {
            var content = {
              csv: onLoadEvent.target.result.replace(/\r\n|\r/g, '\n'),
              header: scope.header,
              separator: scope.separator
            };
            scope.content = content.csv;
            scope.result = csvToJSON(content);
            scope.result.filename = scope.filename;
          });
        };

        if ((onChangeEvent.target.type === "file") && (onChangeEvent.target.files != null || onChangeEvent.srcElement.files != null)) {
          reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0], scope.encoding);
        } else {
          if (scope.content != null) {
            var content = {
              csv: scope.content,
              header: !scope.header,
              separator: scope.separator
            };
            scope.result = csvToJSON(content);
          }
        }
      });

      var csvToJSON = function(content) {
        var lines = content.csv.split('\n');
        //this is my custom edit... so im sorry
        if (lines[0].indexOf(';') > -1) {
          content.separator = ';';
        }

        var result = [];
        var start = 0;
        var columnCount = lines[0].split(content.separator).length;

        var headers = [];
        if (content.header) {
          headers = lines[0].split(content.separator);
          start = 1;
        }

        for (var i = start; i < lines.length; i++) {
          var obj = {};
          var currentline = lines[i].split(new RegExp(content.separator + '(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)'));
          if (currentline.length === columnCount) {
            if (content.header) {
              for (var j = 0; j < headers.length; j++) {
                obj[headers[j]] = currentline[j];
              }
            } else {
              for (var k = 0; k < currentline.length; k++) {
                obj[k] = currentline[k];
              }
            }
            result.push(obj);
          }
        }
        return result;
      };
    }
  };
});

(function($){var nextId=0;var Filestyle=function(element,options){this.options=options;this.$elementFilestyle=[];this.$element=$(element)};Filestyle.prototype={clear:function(){this.$element.val("");this.$elementFilestyle.find(":text").val("");this.$elementFilestyle.find(".badge").remove()},destroy:function(){this.$element.removeAttr("style").removeData("filestyle");this.$elementFilestyle.remove()},disabled:function(value){if(value===true){if(!this.options.disabled){this.$element.attr("disabled","true");this.$elementFilestyle.find("label").attr("disabled","true");this.options.disabled=true}}else{if(value===false){if(this.options.disabled){this.$element.removeAttr("disabled");this.$elementFilestyle.find("label").removeAttr("disabled");this.options.disabled=false}}else{return this.options.disabled}}},buttonBefore:function(value){if(value===true){if(!this.options.buttonBefore){this.options.buttonBefore=true;if(this.options.input){this.$elementFilestyle.remove();this.constructor();this.pushNameFiles()}}}else{if(value===false){if(this.options.buttonBefore){this.options.buttonBefore=false;if(this.options.input){this.$elementFilestyle.remove();this.constructor();this.pushNameFiles()}}}else{return this.options.buttonBefore}}},icon:function(value){if(value===true){if(!this.options.icon){this.options.icon=true;this.$elementFilestyle.find("label").prepend(this.htmlIcon())}}else{if(value===false){if(this.options.icon){this.options.icon=false;this.$elementFilestyle.find(".icon-span-filestyle").remove()}}else{return this.options.icon}}},input:function(value){if(value===true){if(!this.options.input){this.options.input=true;if(this.options.buttonBefore){this.$elementFilestyle.append(this.htmlInput())}else{this.$elementFilestyle.prepend(this.htmlInput())}this.$elementFilestyle.find(".badge").remove();this.pushNameFiles();this.$elementFilestyle.find(".group-span-filestyle").addClass("input-group-btn")}}else{if(value===false){if(this.options.input){this.options.input=false;this.$elementFilestyle.find(":text").remove();var files=this.pushNameFiles();if(files.length>0&&this.options.badge){this.$elementFilestyle.find("label").append(' <span class="badge">'+files.length+"</span>")}this.$elementFilestyle.find(".group-span-filestyle").removeClass("input-group-btn")}}else{return this.options.input}}},size:function(value){if(value!==undefined){var btn=this.$elementFilestyle.find("label"),input=this.$elementFilestyle.find("input");btn.removeClass("btn-lg btn-sm");input.removeClass("input-lg input-sm");if(value!="nr"){btn.addClass("btn-"+value);input.addClass("input-"+value)}}else{return this.options.size}},placeholder:function(value){if(value!==undefined){this.options.placeholder=value;this.$elementFilestyle.find("input").attr("placeholder",value)}else{return this.options.placeholder}},buttonText:function(value){if(value!==undefined){this.options.buttonText=value;this.$elementFilestyle.find("label .buttonText").html(this.options.buttonText)}else{return this.options.buttonText}},buttonName:function(value){if(value!==undefined){this.options.buttonName=value;this.$elementFilestyle.find("label").attr({"class":"btn "+this.options.buttonName})}else{return this.options.buttonName}},iconName:function(value){if(value!==undefined){this.$elementFilestyle.find(".icon-span-filestyle").attr({"class":"icon-span-filestyle "+this.options.iconName})}else{return this.options.iconName}},htmlIcon:function(){if(this.options.icon){return'<span class="icon-span-filestyle '+this.options.iconName+'"></span> '}else{return""}},htmlInput:function(){if(this.options.input){return'<input type="text" class="form-control '+(this.options.size=="nr"?"":"input-"+this.options.size)+'" placeholder="'+this.options.placeholder+'" disabled> '}else{return""}},pushNameFiles:function(){var content="",files=[];if(this.$element[0].files===undefined){files[0]={name:this.$element[0]&&this.$element[0].value}}else{files=this.$element[0].files}for(var i=0;i<files.length;i++){content+=files[i].name.split("\\").pop()+", "}if(content!==""){this.$elementFilestyle.find(":text").val(content.replace(/\, $/g,""))}else{this.$elementFilestyle.find(":text").val("")}return files},constructor:function(){var _self=this,html="",id=_self.$element.attr("id"),files=[],btn="",$label;if(id===""||!id){id="filestyle-"+nextId;_self.$element.attr({id:id});nextId++}btn='<span class="group-span-filestyle '+(_self.options.input?"input-group-btn":"")+'"><label for="'+id+'" class="btn '+_self.options.buttonName+" "+(_self.options.size=="nr"?"":"btn-"+_self.options.size)+'" '+(_self.options.disabled?'disabled="true"':"")+">"+_self.htmlIcon()+'<span class="buttonText">'+_self.options.buttonText+"</span></label></span>";html=_self.options.buttonBefore?btn+_self.htmlInput():_self.htmlInput()+btn;_self.$elementFilestyle=$('<div class="bootstrap-filestyle input-group">'+html+"</div>");_self.$elementFilestyle.find(".group-span-filestyle").attr("tabindex","0").keypress(function(e){if(e.keyCode===13||e.charCode===32){_self.$elementFilestyle.find("label").click();return false}});_self.$element.css({position:"absolute",clip:"rect(0px 0px 0px 0px)"}).attr("tabindex","-1").after(_self.$elementFilestyle);if(_self.options.disabled){_self.$element.attr("disabled","true")}_self.$element.change(function(){var files=_self.pushNameFiles();if(_self.options.input==false&&_self.options.badge){if(_self.$elementFilestyle.find(".badge").length==0){_self.$elementFilestyle.find("label").append(' <span class="badge">'+files.length+"</span>")}else{if(files.length==0){_self.$elementFilestyle.find(".badge").remove()}else{_self.$elementFilestyle.find(".badge").html(files.length)}}}else{_self.$elementFilestyle.find(".badge").remove()}});if(window.navigator.userAgent.search(/firefox/i)>-1){_self.$elementFilestyle.find("label").click(function(){_self.$element.click();return false})}}};var old=$.fn.filestyle;$.fn.filestyle=function(option,value){var get="",element=this.each(function(){if($(this).attr("type")==="file"){var $this=$(this),data=$this.data("filestyle"),options=$.extend({},$.fn.filestyle.defaults,option,typeof option==="object"&&option);if(!data){$this.data("filestyle",(data=new Filestyle(this,options)));data.constructor()}if(typeof option==="string"){get=data[option](value)}}});if(typeof get!==undefined){return get}else{return element}};$.fn.filestyle.defaults={buttonText:"Choose file",iconName:"glyphicon glyphicon-folder-open",buttonName:"btn-default",size:"nr",input:true,badge:true,icon:true,buttonBefore:false,disabled:false,placeholder:""};$.fn.filestyle.noConflict=function(){$.fn.filestyle=old;return this};$(function(){$(".filestyle").each(function(){var $this=$(this),options={input:$this.attr("data-input")==="false"?false:true,icon:$this.attr("data-icon")==="false"?false:true,buttonBefore:$this.attr("data-buttonBefore")==="true"?true:false,disabled:$this.attr("data-disabled")==="true"?true:false,size:$this.attr("data-size"),buttonText:$this.attr("data-buttonText"),buttonName:$this.attr("data-buttonName"),iconName:$this.attr("data-iconName"),badge:$this.attr("data-badge")==="false"?false:true,placeholder:$this.attr("data-placeholder")};$this.filestyle(options)})})})(window.jQuery);
(function() {

    'use strict';

    angular
        .module('app', [
            'ui.router',
            'ngTable',
            'ngSanitize',
            'ngCsvImport',
            'ngThread',
            'ngMessages',
            'ngResource',
            'timer',
            'ui.bootstrap',
            // 'angularjs-datetime-picker',
            'checklist-model',
            'LocalStorageModule',
            'angularSpinner',
            'ui.select',
            'ui.tinymce',
            'naif.base64',
            "bsLoadingOverlay"

        ])
        .config(config)
        .run(run);

    run.$inject = ['bsLoadingOverlayService', 'DialogFactory', '$rootScope'];
    config.$inject = ['usSpinnerConfigProvider', 'localStorageServiceProvider', '$qProvider'];

    // ===========[function]======================================================

    function run(bsLoadingOverlayService, DialogFactory, $rootScope) {
        bsLoadingOverlayService.setGlobalConfig({
            templateUrl: 'views/components/overlay.html'
        });

        $rootScope.openHelp = DialogFactory.openHelpMsg;
        $rootScope.$watch(function() {
            MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
            return true;
        });
    }

    function config(usSpinnerConfigProvider, localStorageServiceProvider) {
        usSpinnerConfigProvider.setTheme('default', {
            color: 'black',
            radius: 20,
            width: 10,
            length: 20
        });

        localStorageServiceProvider
            .setPrefix('eduCbtApp')
            .setStorageType('localStorage')
            .setNotify(true, true)
            .setStorageCookie(1, '<path>', false);

        // qProvider.errorOnUnhandledRejections(false);
    }

})();
(function() {
    'use strict';

    config.$inject = ["$stateProvider", "$urlRouterProvider"];
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
            .state('teacher.eventManagement.correction', {
                url: '/event-correction/:eventId',
                views: {
                    'content@teacher': {
                        templateUrl: 'views/teacher/event/event-corection.html',
                        controller: 'EventManagementController as eventCtrl'
                    }
                }
            }).state('teacher.eventManagement.correction.studentResult', {
                url: '/student-correction/:studentNis',
                views: {
                    'content@teacher': {
                        templateUrl: 'views/teacher/event/event-correction-student.html',
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
(function() {
    'use strict';

    config.$inject = ["$stateProvider", "$urlRouterProvider"];
    angular
        .module('app')
        .config(config);


    // Route configuration for student
    function config($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('student', {
                url: '/student',
                views: {
                    '': {
                        templateUrl: 'views/student/student-home.html',
                        controller: 'LogoutController as logoutCtrl'
                    },
                    'content@student': {
                        templateUrl: 'views/student/student-dashboard/student-dashboard.html',
                        controller: 'StudentDashboardController as stdDsbCtrl'
                    }
                }
            })
            .state('student.task', {
                url: '/task/:eventType',
                views: {
                    'content@student': {
                        templateUrl: 'views/student/student-task/student-task.html',
                        controller: 'StudentTaskController as taskCtrl'
                    }
                }
            })
            .state('student.task.exam', {
                url: '/exam/:eventId',
                views: {
                    'content@student': {
                        templateUrl: 'views/student/student-exam/student-exam.html',
                        controller: 'StudentExamController as studentExamController'
                    }
                }
            })
            .state('student.task.explanation', {
                url: '/explanation/:eventId',
                views: {
                    'content@student': {
                        templateUrl: 'views/student/student-exam/student-exam.html',
                        controller: 'StudentExamController as studentExamController'
                    }
                }
            })
            .state('student.task.exam.result', {
                url: '/result/',
                views: {
                    'content@student': {
                        templateUrl: 'views/student/student-exam-result/student-exam-result.html',
                        controller: 'ExamResultController as examResultController'
                    }
                }
            })
            .state('student.changePswd', {
                url: '/change-pswd',
                views: {
                    'content@student': {
                        templateUrl: 'views/change-password/change-password.html',
                        controller: 'ChangePasswordController as changePswdCtrl'
                    }
                }
            });
    }

})();
(function() {

    'use strict';

    config.$inject = ["$stateProvider", "$urlRouterProvider"];
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
                        controller: ["storageService", function(storageService) {
                            storageService.isUserExistThenRedirectTo();
                        }]
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