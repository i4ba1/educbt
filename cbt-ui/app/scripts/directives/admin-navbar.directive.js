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