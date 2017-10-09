(function() {

    'use strict';
    angular.module('app').directive('mcQst', multipleChoiceQuestion);

    function multipleChoiceQuestion() {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'views/components/question-type-template/multiple-choice-question.html'
        }
    }

})();