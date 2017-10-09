(function() {

    'use strict';
    angular.module('app').directive('passageQst', PassageQuestion);

    function PassageQuestion() {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'views/components/question-type-template/passage-question.html'
        }
    }

})();