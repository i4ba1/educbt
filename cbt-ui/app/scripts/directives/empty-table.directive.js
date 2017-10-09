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