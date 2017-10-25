(function() {
    'use strict';
    angular.module('app').directive('adminNav', adminNavbarMenu);

    function adminNavbarMenu() {
        return {
            restrict: 'A',
            templateUrl: 'views/components/navbar/admin.navbar.tpl.html'
        }
    }

})();
(function() {

    'use strict';
    angular.module('app').directive('teacherNav', teacherNavbarMenu);

    function teacherNavbarMenu() {
        return {
            restrict: 'A',
            templateUrl: 'views/components/navbar/teacher.navbar.tpl.html'
        }
    }

})();
(function() {

    'use strict';
    angular.module('app').directive('studentNav', studentNavbarMenu);

    function studentNavbarMenu() {
        return {
            restrict: 'EA',
            templateUrl: 'views/components/navbar/student.navbar.tpl.html'
        }
    }
})();
(function() {

    'use strict';
    angular.module('app').directive('studentFooter', studentFooter);

    function studentFooter() {
        return {
            restrict: 'A',
            templateUrl: 'views/components/navbar/student.footer.tpl.html'
        }
    }

})();
(function() {
    'use strict';
    angular.module('app').directive('modalDialog', modalDialog);

    function modalDialog() {
        return {
            template: '<div class="modal fade" role="dialog">' +
                '<div class="modal-dialog {{size}}">' +
                '<div class="modal-content">' +
                '<div class="modal-header">' +
                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
                '<h4 class="modal-title">{{ title }}</h4>' +
                '</div>' +
                '<div class="modal-body" ng-transclude></div>' +
                '</div>' +
                '</div>' +
                '</div>',
            restrict: 'E',
            transclude: true,
            replace: true,
            scope: true,
            link: function postLink(scope, element, attrs) {
                scope.title = attrs.title;
                scope.size = attrs.size;

                scope.$watch(attrs.visible, function(value) {
                    if (value == true)
                        $(element).modal('show');
                    else
                        $(element).modal('hide');
                });

                $(element).on('shown.bs.modal', function() {
                    scope.$apply(function() {
                        scope.$parent[attrs.visible] = true;
                    });
                });

                $(element).on('hidden.bs.modal', function() {
                    scope.$apply(function() {
                        scope.$parent[attrs.visible] = false;
                    });
                });
            }
        };
    }

})();
(function() {
    'use strict';
    angular.module('app').directive('modalSpinner', modalSpinner);

    function modalSpinner() {
        return {
            template: '<div class="modal fade" role="dialog">' +
                '<div class="modal-dialog modal-sm">' +
                '<div class="modal-content">' +
                '<div class="modal-header">' +
                '<h4 class="modal-title">{{ title }}</h4>' +
                '</div>' +
                '<div class="modal-body">' +
                '<div style="height:100px">' +
                '<span us-spinner spinner-theme="default"></span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>',
            restrict: 'E',
            transclude: true,
            replace: true,
            scope: true,
            link: function postLink(scope, element, attrs) {
                scope.title = attrs.title;

                scope.$watch(attrs.visible, function(value) {
                    if (value == true)
                        $(element).modal('show');
                    else
                        $(element).modal('hide');
                });

                $(element).on('shown.bs.modal', function() {
                    scope.$apply(function() {
                        scope.$parent[attrs.visible] = true;
                    });
                });

                $(element).on('hidden.bs.modal', function() {
                    scope.$apply(function() {
                        scope.$parent[attrs.visible] = false;
                    });
                });
            }
        };
    }

})();
(function() {

    'use strict';
    angular.module('app').directive('startDateDirective', startDateDirective);

    function startDateDirective() {
        var controller = ['$scope', function($scope) {
            $scope.today = function() {
                $scope.dt = new Date();
            };
            $scope.today();

            $scope.clear = function() {
                $scope.dt = null;
            };

            // Disable weekend selection
            $scope.disabled = function(date, mode) {
                return mode === 'day' && (date.getDay() === 0);
            };

            $scope.minDate = new Date(1975, 0, 1);
            $scope.maxDate = new Date(2020, 11, 31);

            $scope.open1 = function() {
                $scope.popup1.opened = true;
            };

            $scope.open3 = function() {
                $scope.popup3.opened = true;
            };

            $scope.setDate = function(year, month, day) {
                $scope.dt = new Date(year, month, day);
            };

            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };

            $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy',
                'shortDate'
            ];
            $scope.format = $scope.formats[0];
            $scope.altInputFormats = ['M!/d!/yyyy'];

            $scope.popup1 = {
                opened: false
            };

            $scope.popup3 = {
                opened: false
            };

            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            var afterTomorrow = new Date();
            afterTomorrow.setDate(tomorrow.getDate() + 1);
            $scope.events = [{
                date: tomorrow,
                status: 'full'
            }, {
                date: afterTomorrow,
                status: 'partially'
            }];

            $scope.getDayClass = function(date, mode) {
                if (mode === 'day') {
                    var dayToCheck = new Date(date)
                        .setHours(0, 0, 0, 0);

                    for (var i = 0; i < $scope.events.length; i++) {
                        var currentDay = new Date($scope.events[i].date)
                            .setHours(0, 0, 0, 0);

                        if (dayToCheck === currentDay) {
                            return $scope.events[i].status;
                        }
                    }
                }

                return '';
            };

        }];

        var template = '<p class="input-group">' +
            '<input name="{{name}}" type="text" ng-disabled="disable" class="form-control" uib-datepicker-popup="dd-MM-yyyy" ng-model="dt" is-open="popup3.opened" min-date="minDate" max-date="maxDate"' +
            'datepicker-options="dateOptions" ng-required="true" close-text="Close"/>' +
            '<span class="input-group-btn"><button type="button" class="btn btn-default" ng-click="open3()">' +
            '<i class="glyphicon glyphicon-calendar"></i>' +
            '</button>' +
            '</span>' +
            '</p>';

        return {
            restrict: 'EA', //Default in 1.3+
            controller: controller,
            scope: {
                dt: '=',
                disable: '=',
                name: '@'
            },
            template: template
        };
    }


})();
(function() {

    'use strict';
    angular.module('app').directive('endDateDirective', endDateDirective);

    function endDateDirective() {
        var controller = ['$scope', function($scope) {
            $scope.today = function() {
                $scope.endDate = new Date();
            };
            $scope.today();

            $scope.clear = function() {
                $scope.endDate = null;
            };

            // Disable weekend selection
            $scope.disabled = function(date, mode) {
                return mode === 'day' && (date.getDay() === 0 || date.getDay() ===
                    6);
            };

            $scope.toggleMin = function() {
                $scope.minDate = $scope.minDate ? null : new Date();
            };

            $scope.toggleMin();
            $scope.maxDate = new Date(2020, 5, 22);

            $scope.open1 = function() {
                $scope.popup1.opened = true;
            };

            $scope.open4 = function() {
                $scope.popup4.opened = true;
            };

            $scope.setDate = function(year, month, day) {
                $scope.endDate = new Date(year, month, day);
            };

            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };

            $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy',
                'shortDate'
            ];
            $scope.format = $scope.formats[0];
            $scope.altInputFormats = ['M!/d!/yyyy'];

            $scope.popup1 = {
                opened: false
            };

            $scope.popup4 = {
                opened: false
            };

            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            var afterTomorrow = new Date();
            afterTomorrow.setDate(tomorrow.getDate() + 1);
            $scope.events = [{
                date: tomorrow,
                status: 'full'
            }, {
                date: afterTomorrow,
                status: 'partially'
            }];

            $scope.getDayClass = function(date, mode) {
                if (mode === 'day') {
                    var dayToCheck = new Date(date)
                        .setHours(0, 0, 0, 0);

                    for (var i = 0; i < $scope.events.length; i++) {
                        var currentDay = new Date($scope.events[i].date)
                            .setHours(0, 0, 0, 0);

                        if (dayToCheck === currentDay) {
                            return $scope.events[i].status;
                        }
                    }
                }

                return '';
            };

        }];

        var template = '<p class="input-group">' +
            '<input type="text" class="form-control" uib-datepicker-popup ng-model="endDate" is-open="popup4.opened" min-date="minDate" max-date="maxDate"' +
            'datepicker-options="dateOptions" date-disabled="disabled(date, mode)" ng-required="true" close-text="Close"/>' +
            '<span class="input-group-btn"><button type="button" class="btn btn-default" ng-click="open4()">' +
            '<i class="glyphicon glyphicon-calendar"></i>' +
            '</button>' +
            '</span>' +
            '</p>';

        return {
            restrict: 'EA', //Default in 1.3+
            controller: controller,
            template: template
        };
    }

})();
(function() {
    'use strict';
    angular.module('app').directive('religionOption', religionOption);

    function religionOption() {
        return {
            scope: {
                religionVar: '='
            },
            restrict: 'E',
            template: '<select name="religion" class="form-control" ng-model="religionVar" ng-required="true">' +
                '<option value="ISLAM">ISLAM</option>' +
                '<option value="PROTESTANT">KRISTEN</option>' +
                '<option value="BUDDHA">BUDHA</option>' +
                '<option value="CHRISTIAN">KATOLIK</option>' +
                '<option value="HINDU">HINDU</option>' +
                '</select>',
            replace: true

        };
    }


})();
(function() {

    'use strict';
    angular.module('app').directive('classOption', classOption);

    function classOption() {
        var controller = ['$scope', 'classService', 'localStorageService', function($scope, classService, localStorageService) {
            $scope.classData = [];
            var token = localStorageService.get("TOKEN");

            function getAllClass() {
                classService.fetchAllClass(token).then(
                    function(response) {
                        $scope.classData = response.data;
                    },
                    function(errorResponse) {

                    }
                );
            };

            getAllClass();
        }];
        return {
            scope: {
                classVar: '=',
            },
            controller: controller,
            restrict: 'E',
            replace: true,
            template: '<select name="classOption" class="form-control" ng-model="classVar" ng-required="true">' +
                '<option ng-repeat="option in classData" value="{{option.id}}">{{option.className}}</option>' +
                '</select>',
            link: function(scope, elem, attrs) {}
        };
    }

})();
(function() {

    'use strict';
    angular.module('app').directive('fileModel', fileModel);

    fileModel.$inject = ['$parse'];

    function fileModel($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function() {
                    scope.$apply(function() {
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }
})();
(function() {

    'use strict';
    angular.module('app').directive('uploadHandle', uploadHandle);

    uploadHandle.$inject = ['$parse'];

    function uploadHandle($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    scope.image = e.target.result;
                    scope.$apply();
                }

                element.on('change', function() {
                    reader.readAsDataURL(element[0].files[0]);
                });
            }
        };
    }
})();
(function() {

    'use strict';
    angular.module('app').directive('emptyTable', emptyTableDirective);

    function emptyTableDirective() {
        return {
            template: '<table class="table table-bordered">' +
                '<thead>' +
                '<tr>' +
                '<th width="50" class="text-center">No</th>' +
                '<th ng-repeat="column in headers track by $index" class="text-center">{{column}}</th>' +
                '<th width="75"></th>' +
                '</tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr>' +
                '<td colspan="{{colspan}}" align="center">{{content}}</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</div>',
            restrict: 'E',
            transclude: true,
            replace: true,
            scope: true,
            link: function postLink(scope, element, attrs) {
                scope.headers = JSON.parse(attrs.headers);
                scope.colspan = attrs.colspan;
                scope.content = attrs.content;
            }
        };
    }
})();
(function() {

    'use strict';
    angular.module('app').directive('tfQst', trueFalseQuestion);

    function trueFalseQuestion() {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'views/components/question-type-template/true-and-false-question.html'
        }
    }

})();
(function() {

    'use strict';
    angular.module('app').directive('mcQst', multipleChoiceQuestion);

    function multipleChoiceQuestion() {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'views/components/question-type-template/multiple-choice-question.html'
        }
    }

})();
(function() {

    'use strict';
    angular.module('app').directive('mtchQst', matchQuestion);

    function matchQuestion() {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'views/components/question-type-template/matching-question.html'
        }
    }

})();
(function() {

    'use strict';
    angular.module('app').directive('passageQst', PassageQuestion);

    function PassageQuestion() {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'views/components/question-type-template/passage-question.html'
        }
    }

})();