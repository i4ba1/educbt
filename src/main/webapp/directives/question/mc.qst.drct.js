(function() {

    'use strict';
    angular.module('app').directive('mcQst', multipleChoiceQuestion);

    function multipleChoiceQuestion() {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'sections/teacher/question-bank/question-type/mc.qst.html'
        }
    }

})();