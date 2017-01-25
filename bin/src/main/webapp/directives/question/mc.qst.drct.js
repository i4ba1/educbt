angular
  .module('app.core')
  .directive('mcQst', function() {
    return {
      restrict: 'EA',
      replace: true,
      templateUrl: 'sections/teacher/question-bank/question-type/mc.qst.html'
    }
  });
