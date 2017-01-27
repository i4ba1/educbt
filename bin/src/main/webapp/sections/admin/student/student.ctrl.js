angular.module('app.core')
  .controller('StudentController', function($scope, $filter, ngTableParams,
    $stateParams, $state, studentService, deferredService, classService, $timeout, $log, storageService, errorHandle, $uibModal) {

    var token = " ";
    /*
     * checking authorization
     */
    if (!storageService.isAuthorization("ADMIN")) {
      $state.go("login");
    } else {
      token = storageService.getToken();
    }

    /*
     * Global / Scope variable
     * All Variable Declared in here first time
     */
    $scope.csv = {
      content: null,
      header: true,
      headerVisible: true,
      separator: ',',
      separatorVisible: true,
      result: null,
      encoding: 'ISO-8859-1',
      encodingVisible: true,
    };

    $scope.studentTable = null;
    $scope.students = [];
    $scope.data = null;
    $scope.isUpdate = false;
    $scope.selectedStudent = {
      "firstName": "",
      "lastName": "",
      "email": "",
      "address": "",
      "birthPlace": "",
      "birthDate": "",
      "mobilePhone": "",
      "phone": "",
      "gender": "",
      "religion": "",
      "deleted": false,
      "nis": "",
      "kelas": {
        "id": 0,
        "className": "",
        "createdDate": "",
        "activated": true,
        "events": null
      }
    };
    $scope.showModal = false;
    $scope.showModalLoading = false;
    $scope.classID = "";

    /*
     *This Function used to fetch all student data
     */
    function findAll() {
      var promise = deferredService.getPromise(studentService.fetchAllStudents(token));
      promise.then(
        function(response) {
          $scope.students = response.data;
        },
        function(errorResponse) {
          errorHandle.setError(errorResponse);
        }
      ).then(function() {
        updateTableData($scope.students);
      });

    };

    /*
     *This Function used to find student by NIS
     *@param student.nis
     */
    function findStudent(nis) {
      var promise = deferredService.getPromise(studentService.findStudent(nis, token));
      promise.then(
        function(response) {
          $scope.selectedStudent = response.data;
          $scope.selectedStudent.birthDate = new Date(response.data.birthDate);
          $scope.classID = "" + response.data.kelas.id;
        },
        function(errorResponse) {
          errorHandle.setError(errorResponse);
        }
      );
    };

    /*
     *This Function used to import all student from file.csv
     */
    $scope.importStudent = function() {
      var params = [{
        authorization: token,
        students: $scope.csv.result
      }];
      $scope.showModalLoading = true;
      var promise = deferredService.getPromise(studentService.importStudent(params));
      promise.then(
        function(response) {
          $scope.showModalLoading = false;
          $timeout(function() {
            $state.go('admin.studentMgmt');
          }, 500);
        },
        function(errorResponse) {
          $scope.showModalLoading = false;
          if (errorResponse.status == 409) {
            $timeout(function() {
              $scope.open("Gagal Simpan", ["NIS siswa sudah digunakan", "Silahkan gunakan NIS yang berbeda"]);
            },1000);
          }
          errorHandle.setError(errorResponse);
        });
    }

    /*
     *This Function used save or update
     *SAVING when $scope.isUpdate equal false
     *and UPDATING when $scope.isUpdate equal true
     */
    $scope.saveOrUpdate = function() {
      var promise = deferredService.getPromise(classService.findClass($scope.classID, token));

      promise.then(
        function(response) {
          $scope.selectedStudent.kelas = response.data;
        },
        function(errorResponse) {}
      ).then(
        function() {
          var promise2 = null;
          var params = [];
          var param = {};
          param.authorization = token;
          param.student = $scope.selectedStudent;
          if ($scope.selectedStudent.birthDate instanceof Date) {
            param.student.birthDate = $scope.selectedStudent.birthDate.getTime();
          } else {
            param.student.birthDate = $scope.selectedStudent.birthDate;
          }
          params.push(param);

          if ($scope.isUpdate) {
            promise2 = deferredService.getPromise(studentService.updateStudent(params));
            promise2.then(
              function(response) {
                $state.go('admin.studentMgmt');
              },
              function(errorResponse) {
                errorHandle.setError(errorResponse);
              });
          } else {
            $log.info($scope.selectedStudent);
            promise2 = deferredService.getPromise(studentService.createStudent(params));
            promise2.then(
              function(response) {
                $state.go('admin.studentMgmt');
              },
              function(errorResponse) {
                if (errorResponse.status == 409) {
                  $scope.open("Gagal Simpan", ["NIS siswa sudah digunakan", "Silahkan gunakan NIS yang berbeda"]);
                } else {
                  errorHandle.setError(errorResponse);
                }
              });
          }
        }
      );
    };

    $scope.delete = function() {
      var promise = deferredService.getPromise(studentService.deleteStudent($scope.selectedStudent.nis, token));
      promise.then(
        function(response) {
          $scope.showModal = false;
          findAll();
        },
        function(errorResponse) {
          errorHandle.setError(errorResponse);
        });
    };

    /*
     *This Function for toggle modal to show delete confirmation
     */
    $scope.toggleModal = function(student) {
      $scope.showModal = !$scope.showModal;
      $scope.selectedStudent = student;
    };

    /*
     * used for update ngTableParams to show all Studnet in table
     */
    function updateTableData(data_table) {
      $scope.studentTable = new ngTableParams({
        page: 1,
        count: 10
      }, {
        getData: function($defer, params) {
          $scope.data = params.sorting() ? $filter('orderBy')(data_table,
            params.orderBy()) : data_table;
          $scope.data = params.filter() ? $filter('filter')($scope.data,
            params.filter()) : $scope.data;
          $scope.data = $scope.data.slice((params.page() - 1) * params.count(),
            params.page() * params.count());
          $defer.resolve($scope.data);
        },
        total: data_table.length
      });
    }


    /*
     * State of Routing,
     */
    if ($state.is('admin.studentMgmt')) {
      findAll();
    } else if ($state.is('admin.studentImport')) {
      $scope.download = function(resource) {
        window.open(resource);
      }

      $scope.updateData = function() {
        updateTableData($scope.csv.result);
      }

    } else if ($state.is('admin.studentMgmt.studentDetail')) {
      if ($stateParams.studentNis != undefined && $stateParams.studentNis != null && $stateParams.studentNis != "") {
        findStudent($stateParams.studentNis);
        $scope.isUpdate = true;
      } else {
        $scope.isUpdate = false;
      }
    }

    $scope.open = function(title, messages) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'components/modal-template/error.html',
        controller: 'ModalInstanceCtrl',
        size: 'sm',
        resolve: {
          modalData: function() {
            return {
              title: title,
              messages: messages,
              content: ''
            };
          }
        }
      });
    };

  });