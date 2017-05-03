angular
  .module('app.core')
  .directive('adminNav', function() {
    return {
      restrict: 'A',
      templateUrl: 'components/navbar/admin.navbar.tpl.html'
    }
  });
