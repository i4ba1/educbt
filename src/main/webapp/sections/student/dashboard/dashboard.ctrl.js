angular.module('app.core')
  .controller('StudentDashboardController', function($scope, $state, deferredService, taskService, studentService, storageService, errorHandle, schoolProfileService, baseUrl, $sce, tinyMce) {
    var currentStudent;
    var token;
    var url = baseUrl.getUrl();
    url = (url.split("/cbt-backend"))[0];
    $scope.selectedStudent;
    $scope.schoolProfile = {
      "schoolName": "",
      "schoolDescription": "",
      "content": "assets/images/profile.png"
    };

    /*
     * checking authorization
     */
    if (!storageService.isAuthorization("STUDENT")) {
      $state.go("login");
    } else {
      token = storageService.getToken();
      currentStudent = storageService.getLoggedInUser();
      findStudent(currentStudent.nis).then(function() {
        getAllPublishedTask($scope.selectedStudent.kelas.id);
        fetchScoolProfile();
      });
    }

    $scope.trustAsHtml = tinyMce.trustAsHtml;

    $scope.notification = [{
      type: 'TUGAS',
      count: 0,
      visible: false
    }, {
      type: 'KUIS',
      count: 0,
      visible: false
    }, {
      type: 'TRYOUT_UTS|TRYOUT_UAS',
      count: 0,
      visible: false
    }, {
      type: 'TRYOUT_UAN',
      count: 0,
      visible: false
    }];

    function findStudent(nis) {
      var promise = deferredService.getPromise(studentService.findStudent(nis, token));
      promise.then(
        function(response) {
          $scope.selectedStudent = response.data;
          $scope.selectedStudent.birthDate = new Date(response.data.birthDate);
        },
        function(error) {
          errorHandle.setError(error);
        }
      );
      return promise;
    };

    function fetchScoolProfile() {
      var promise = deferredService.getPromise(schoolProfileService.fetchProfile(token));
      promise.then(
        function(response) {
          $scope.schoolProfile = response.data;
          $scope.schoolProfile.content = 'data:' + $scope.schoolProfile.contentType + ';base64,' + $scope.schoolProfile.fileData;
        },
        function(error) {
          errorHandle.setError(error);
        }
      );
      return promise;
    };

    function getAllPublishedTask(classId) {
      var promise = deferredService.getPromise(taskService.fetchAllPublishedTask(classId, token));
      promise.then(
        function(response) {
          angular.forEach(response.data, function(d) {
            if (d.eventType == 'TUGAS') {
              $scope.notification[0].count = $scope.notification[0].count + 1;
              $scope.notification[0].visible = true;
            } else if (d.eventType == 'KUIS') {
              $scope.notification[1].count = $scope.notification[1].count + 1;
              $scope.notification[1].visible = true;
            } else if (d.eventType == 'TRYOUT_UAN') {
              $scope.notification[3].count = $scope.notification[3].count + 1;
              $scope.notification[3].visible = true;
            } else {
              $scope.notification[2].count = $scope.notification[2].count + 1;
              $scope.notification[2].visible = true;
            }
          });
        },
        function(error) {
          errorHandle.setError(error);
        });
    };

  });