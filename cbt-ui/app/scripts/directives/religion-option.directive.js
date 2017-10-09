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