(function() {

    'use strict';
    angular.module('app').directive('studentFooter', studentFooter);

    function studentFooter() {
        return {
            restrict: 'A',
            templateUrl: 'components/navbar/student.footer.tpl.html'
        }
    }

})();