angular.module('app.core')
  .directive('uploadHandle', ['$parse', function($parse) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var reader = new FileReader();
        reader.onload = function(e) {
          scope.image = e.target.result;
          scope.$apply();
        }

        element.on('change', function() {
          reader.readAsDataURL(element[0].files[0]);
        });
      }
    };
  }]);
