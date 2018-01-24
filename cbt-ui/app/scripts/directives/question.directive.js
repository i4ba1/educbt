(function() {

    'use strict';
    angular.module('app')
        .directive('tfQst', trueFalseQuestion)
        .directive('passageQst', PassageQuestion)
        .directive('mcQst', multipleChoiceQuestion)
        .directive('mtchQst', matchQuestion)
        .directive('essayQst', essayQuestion);

    // match
    function matchQuestion() {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'views/components/question-type-template/matching-question.html'
        }
    }

    // essay
    function essayQuestion() {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'views/components/question-type-template/essay-question.html'
        }
    }

    // multiple choice
    function multipleChoiceQuestion() {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'views/components/question-type-template/multiple-choice-question.html'
        }
    }

    // true false
    function trueFalseQuestion() {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'views/components/question-type-template/true-and-false-question.html'
        }
    }

    // passage
    function PassageQuestion() {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'views/components/question-type-template/passage-question.html'
        }
    }

})();