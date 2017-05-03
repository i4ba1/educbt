angular
  .module('app.core')
  .directive('tfQst', function() {
    return {
      restrict: 'EA',
      replace: true,
      templateUrl: 'sections/teacher/question-bank/question-type/tf.qst.html'
    }
  });
