(function() {

    'use strict';
    angular.module('app').directive('tfQst', trueFalseQuestion);

    function trueFalseQuestion() {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'sections/teacher/question-bank/question-type/tf.qst.html'
        }
    }

})();