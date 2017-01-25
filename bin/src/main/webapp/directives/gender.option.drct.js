angular.module('app.core')
  .directive('genderOption', function() {
    return {
      scope: {
        genderVar: '='
      },
      restrict: 'E',
      replace: true,
      template: '<select name="gender" class="form-control" ng-model="genderVar">' +
        '<option value= "MALE"> LAKI-LAKI</option>' +
        '<option value= "FEMALE"> PEREMPUAN </option>' +
        '</select>'
    };
  });
