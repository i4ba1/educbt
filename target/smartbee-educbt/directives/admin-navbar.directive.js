(function() {
    'use strict';
    angular.module('app').directive('adminNav', adminNavbarMenu);

    function adminNavbarMenu() {
        return {
            restrict: 'A',
            templateUrl: 'components/navbar/admin.navbar.tpl.html'
        }
    }

})();