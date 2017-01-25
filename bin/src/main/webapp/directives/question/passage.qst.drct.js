angular
  .module('app.core')
  .directive('passageQst', function() {
    return {
      restrict: 'EA',
      replace: true,
      templateUrl: 'sections/teacher/question-bank/question-type/passage.qst.html'
    }
  });
