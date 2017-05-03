angular
  .module('app.core')
  .directive('teacherNav', function() {
    return {
      restrict: 'A',
      templateUrl: 'components/navbar/teacher.navbar.tpl.html'
    }
  });
