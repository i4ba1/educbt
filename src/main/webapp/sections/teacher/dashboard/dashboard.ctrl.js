angular.module('app.core')
  .controller('TeacherDashboardController', function($scope, $state, storageService, teacherService) {
    /*
     * checking authorization
     */
    if (!storageService.isAuthorization("EMPLOYEE")) {
      $state.go("login");
    } else {
      var user = storageService.getLoggedInUser();
      teacherService.findTeacher(user.nip, storageService.getToken());
    }

    $scope.dashboardRoute = function(params) {
      if (params == 'questionBank') {
        $state.go('teacher.questionBank');
      } else if (params == 'eventManagement') {
        $state.go('teacher.eventManagement');
      } else if (params == 'settings') {
        $state.go('teacher.accountSetting');
      }
    }
  });
