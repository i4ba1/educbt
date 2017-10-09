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