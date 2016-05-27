angular.module('app.core')
  .directive('classOption', function() {
    var controller = ['$scope', 'classService','localStorageService', function($scope, classService, localStorageService) {
      $scope.classData = [];
      var token = localStorageService.get("TOKEN");
      function getAllClass() {
        classService.fetchAllClass(token).then(
          function(response) {
            $scope.classData = response.data;
          },
          function(errorResponse) {

          }
        );
      };

      getAllClass();
    }];
    return {
      scope: {
        classVar: '=',
      },
      controller: controller,
      restrict: 'E',
      replace: true,
      template: '<select name="classOption" class="form-control" ng-model="classVar" ng-required="true">' +
        '<option ng-repeat="option in classData" value="{{option.id}}">{{option.className}}</option>' +
        '</select>',
      link: function(scope, elem, attrs) {}
    };
  });
