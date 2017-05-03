angular
  .module('app.core')
  .directive('studentFooter', function() {
    return {
      restrict: 'A',
      templateUrl: 'components/navbar/student.footer.tpl.html'
    }
  });
