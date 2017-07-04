(function() {

    'use strict';
    angular.module('app').directive('tfQst', trueFalseQuestion);

    function trueFalseQuestion() {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'components/question-type-template/true-and-false-question.html'
        }
    }

})();