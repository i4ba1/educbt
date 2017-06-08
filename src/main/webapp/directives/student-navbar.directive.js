(function() {

    'use strict';
    angular.module('app').directive('studentNav', studentNavbarMenu);

    function studentNavbarMenu() {
        return {
            restrict: 'EA',
            templateUrl: 'components/navbar/student.navbar.tpl.html'
        }
    }
})();