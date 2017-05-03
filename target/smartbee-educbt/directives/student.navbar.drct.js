angular
  .module('app.core')
  .directive('studentNav', function() {
    return {
      restrict: 'EA',
      templateUrl: 'components/navbar/student.navbar.tpl.html'
    }
  });
