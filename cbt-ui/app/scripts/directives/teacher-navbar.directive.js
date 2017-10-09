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