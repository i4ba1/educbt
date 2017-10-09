(function() {

    'use strict';
    angular.module('app').directive('mtchQst', matchQuestion);

    function matchQuestion() {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'views/components/question-type-template/matching-question.html'
        }
    }

})();