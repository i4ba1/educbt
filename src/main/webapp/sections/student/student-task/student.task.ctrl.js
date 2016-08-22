angular.module('app.core')
  .controller('StudentTaskController', function($scope, $state, taskService, deferredService, $stateParams, studentService, storageService, errorHandle, $window, $timeout, DialogFactory) {

    var currentStudent;
    var token = " ";

    /*
     * checking authorization
     */
    if (!storageService.isAuthorization("STUDENT")) {
      $state.go("login");
    } else {
      currentStudent = storageService.getLoggedInUser();
      token = storageService.getToken();

    }

    /*
     * Global Variable
     */
    $scope.titleData = {
      availableOptions: [{
        'title': 'Tugas',
        'ico': 'book',
        'value': 'TUGAS'
      }, {
        'title': 'Kuis',
        'ico': 'gamepad',
        'value': 'KUIS'
      }, {
        'title': 'Tryout UTS/UAS',
        'ico': 'language',
        'value': 'TRYOUT_UTS|TRYOUT_UAS'
      }, {
        'title': 'Tryout UAN',
        'ico': 'cubes',
        'value': 'TRYOUT_UAN'
      }],
      selectedOption: null
    };

    $scope.paginationVisible = false;
    $scope.tasks = [];
    $scope.pageConfig = {
      currentPage: 1,
      maxSize: 5,
      itemPage: 4,
      totalItem: 0,
      boundaryLink: true,
      rotate: false
    };

    $scope.kerjakan = function(eventId) {
      var params = [];
      var param = {
        'authorization': token,
        'studentAnswer': {
          'nis': currentStudent.nis,
          'eventId': eventId
        }
      };

      params.push(param);
      var promise = deferredService.getPromise(taskService.createStudentAnswer(params));
      promise.then(
        function(response) {
          $state.go('student.task.exam', {
            'eventId': eventId
          });
        },
        function(errorResponse) {
          errorHandle.setError(errorResponse);
        });

    };

    $scope.pembahasan = function(data) {
      if (data.status == 'COMPLETED') {
        $state.go('student.task.explanation', {
          'eventId': data.id
        });
      } else {
         DialogFactory.showDialogMsg("Pembahasan Belum Tersedia","Pembahasan bisa di akses setelah ujian berakhir","md");

      }
    }

    $scope.disableKerjakan = function(data) {
      var result = false;
      if (data.finish || data.status != 'RELEASED') {
        result = true;
      } else if (!data.finish && data.status == 'RELEASED') {
        result = false;
      }
      return result;
    }

    $scope.disablePembahasan = function(data) {
      var result = false;
      if (data.finish || data.status == 'COMPLETED') {
        result = false;
      } else {
        result = true;
      }
      return result;
    }

    /*
     * get All Event
     */
    function getAllTask(eventType) {
      $scope.paginationVisible = false;
      var promise = deferredService.getPromise(taskService.fetchAllTask(eventType, $scope.selectedStudent, token));
      promise.then(
        function(response) {
          $scope.tasks = [];
          angular.forEach(response.data, function(d) {
            var task = {
              data: null,
              img_path: '',
              img_ext: '',
            };
            task.data = d;
            task.img_path = 'assets/images/thumbnail-tpl/';
            task.img_ext = '_1.png';
            $scope.tasks.push(task);
          });
          $scope.pageConfig.totalItem = $scope.tasks.length;
          if ($scope.tasks.length > 0) {
            $scope.paginationVisible = true;
          }
        },
        function(error) {
          errorHandle.setError(error);
        }
      );
    }

    /*
     *This Function used to find student by NIS
     *@param student.nis
     */
    $scope.selectedStudent;

    function findStudent(nis) {
      var promise = deferredService.getPromise(studentService.findStudent(nis, token));
      promise.then(
        function(response) {
          $scope.selectedStudent = response.data;
          $scope.selectedStudent.birthDate = new Date(response.data.birthDate);
        },
        function(errorResponse) {
          errorHandle.setError(errorResponse);
        });
      return promise;
    };

    /*
     * Refreshing Task
     */
    $scope.refreshTask = function(eventType) {
      getAllTask(eventType);
    }

    /*
     * state condition
     */
    if ($stateParams.eventType == 'tugas') {
      $scope.titleData.selectedOption = $scope.titleData.availableOptions[0];
      findStudent(currentStudent.nis).then(function() {
        getAllTask($scope.titleData.selectedOption.value);
      });
    } else if ($stateParams.eventType == 'kuis') {
      $scope.titleData.selectedOption = $scope.titleData.availableOptions[1];
      findStudent(currentStudent.nis).then(function() {
        getAllTask($scope.titleData.selectedOption.value);
      });
    } else if ($stateParams.eventType == 'tryout_uas') {
      $scope.titleData.selectedOption = $scope.titleData.availableOptions[2];
      findStudent(currentStudent.nis).then(function() {
        getAllTask($scope.titleData.selectedOption.value);
      });
    } else if ($stateParams.eventType == 'tryout_uan') {
      $scope.titleData.selectedOption = $scope.titleData.availableOptions[3];
      findStudent(currentStudent.nis).then(function() {
        getAllTask($scope.titleData.selectedOption.value);
      });
    }

  });
