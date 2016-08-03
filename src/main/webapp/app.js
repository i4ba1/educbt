'use strict';

angular.module('app', [
  'ui.router',
  'app.routes',
  'app.routes.teacher',
  'app.routes.student',
  'app.core',
  'ngTable',
  'ngSanitize',
  'timer',
  'ui.bootstrap',
  'angularjs-datetime-picker',
  'ngCsvImport',
  'ngThread',
  'checklist-model',
  'paginationFilter',
  'LocalStorageModule',
  'ngMessages',
  'ui.tinymce',
  'app.config',
  'angularSpinner',
  'app.messages'
]).config(['usSpinnerConfigProvider', function(usSpinnerConfigProvider) {
  usSpinnerConfigProvider.setTheme('default', {
    color: 'black',
    radius: 20,
    width: 10,
    length: 20
  });
}]);