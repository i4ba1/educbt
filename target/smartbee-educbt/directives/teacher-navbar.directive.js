(function() {

    'use strict';
    angular.module('app').directive('teacherNav', teacherNavbarMenu);

    function teacherNavbarMenu() {
        return {
            restrict: 'A',
            templateUrl: 'components/navbar/teacher.navbar.tpl.html'
        }
    }

})();