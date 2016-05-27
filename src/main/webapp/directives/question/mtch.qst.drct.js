angular
  .module('app.core')
  .directive('mtchQst', function() {
    return {
      restrict: 'EA',
      replace: true,
      templateUrl: 'sections/teacher/question-bank/question-type/mtch.qst.html'
    }
  });
