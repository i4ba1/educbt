(function() {

    'use strict';
    angular.module('app').directive('mtchQst', matchQuestion);

    function matchQuestion() {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'sections/teacher/question-bank/question-type/mtch.qst.html'
        }
    }

})();