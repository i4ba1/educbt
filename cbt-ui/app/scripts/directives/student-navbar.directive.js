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