angular.module('app.core')
  .directive('maritalStatusOption', function() {
    return {
      scope: {
        maritalStatusVar: '='
      },
      restrict: 'E',
      replace: true,
      template: '<select name="status" class="form-control" ng-model="maritalStatusVar">' +
        '<option value="SINGLE">BELUM MENIKAH</option>' +
        '<option value="MARRIED">MENIKAH</option>' +
        '<option value="WIDOW">DUDA</option>' +
        '</select>'
    };
  });
