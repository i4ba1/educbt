(function() {

    'use strict';
    angular.module('app').directive('passageQst', PassageQuestion);

    function PassageQuestion() {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'sections/teacher/question-bank/question-type/passage.qst.html'
        }
    }

})();