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