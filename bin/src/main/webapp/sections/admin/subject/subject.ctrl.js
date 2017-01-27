'use strict';
angular
  .module('app.core')
  .controller('SubjectController', function($scope, $filter, ngTableParams, $stateParams, $state, subjectService, storageService, deferredService, errorHandle, $timeout, $uibModal) {

    /*
     * checking authorization
     */

    var token = " ";
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

    $scope.subjectsTable = null;
    $scope.data = null;
    $scope.subjects = null;
    $scope.selectedSubject = null;
    $scope.isUpdate = false;
    $scope.showModal = false;
    $scope.showModalLoading = false;
    $scope.index = 0;
    $scope.isAdd = true;


    /*
     *This Function used to fetch all teacher data
     */
    function findAll() {
      var promise = deferredService.getPromise(subjectService.fetchAllSubject(token));
      promise.then(
          function(response) {
            $scope.subjects = response.data;
          },
          function(errorResponse) {
            errorHandle.setError(errorResponse);
          })
        .then(function() {
          updateTableData($scope.subjects);
        });
    };

    /*
     * fin subject by subject id to editing selected subject
     */
    function findSubject(id) {
      var promise = deferredService.getPromise(subjectService.findSubject(id, token));
      promise.then(
        function(response) {
          $scope.selectedSubject = response.data;
        },
        function(errorResponse) {
          errorHandle.setError(errorResponse);
        }
      );
    };

    /*
     *This Function used save or update
     *SAVING when $scope.isUpdate equal false
     *and UPDATING when $scope.isUpdate equal true
     */
    $scope.saveOrUpdate = function() {
      var params = [];
      var param = {};
      var promise;
      param.authorization = token;
      param.subject = $scope.selectedSubject;

      params.push(param);

      if ($scope.isUpdate) {
        promise = deferredService.getPromise(subjectService.updateSubject(params));
        promise.then(
          function(response) {
            $state.go('admin.subjectMgmt');
          },
          function(errorResponse) {
            errorHandle.setError(errorResponse);
          });
      } else {
        promise = deferredService.getPromise(subjectService.createSubject(params));
        promise.then(
          function(response) {
            $state.go('admin.subjectMgmt');
          },
          function(errorResponse) {
            if (errorResponse.status == 409) {
              $scope.open("Gagal Simpan", ["matapelajaran sudah pernah dibuat"]);
            } else {
              errorHandle.setError(errorResponse);
            }
          });
      }
    };

    /*
     * used for deleting selected subject by subject id
     */
    $scope.delete = function() {
      var promise = deferredService.getPromise(subjectService.deleteSubject($scope.selectedSubject.id, token));
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
     * used for show delete confirmation dialog
     */
    $scope.toggleModal = function(subject) {
      $scope.showModal = !$scope.showModal;
      $scope.selectedSubject = subject;
    }

    /*
     * used for importing subject by CSV file
     */
    $scope.importSubject = function() {
      var params = [];
      var param = {};
      param.authorization = token;
      param.subjects = $scope.csv.result;
      params.push(param);
      $scope.showModalLoading = true;
      var promise = deferredService.getPromise(subjectService.importSubject(params));
      promise.then(
        function(response) {
          $scope.showModalLoading = false;
          $timeout(function() {
            $state.go('admin.subjectMgmt');
          }, 500);
        },
        function(errorResponse) {
          $scope.showModalLoading = false;
          if (errorResponse.status == 409) {
            $timeout(function() {
              $scope.open("Gagal Simpan", ["matapelajaran sudah pernah dibuat"]);
            }, 1000);
          }
          errorHandle.setError(errorResponse);
        });
    };

    /*
     * Used for revalidate  null subject name
     */
    function validateImport(csv_result) {
      var valid_data = [];
      angular.forEach(csv_result, function(data) {
        if (data.subjectName != null && data.subjectName != undefined && data.subjectName != "") {
          valid_data.push(data);
        }
      });
      return valid_data;
    };

    /*
     * used for update subjectTableParams to show all subject
     */
    function updateTableData(data_table) {
      $scope.subjectsTable = new ngTableParams({
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
    };

    /*
     * state of routing
     */
    if ($state.is('admin.subjectMgmt')) {
      findAll();
    } else if ($state.is('admin.subjectImport')) {

      $scope.download = function(resource) {
        window.open(resource);
      }

      $scope.updateData = function() {
        $scope.csv.result = validateImport($scope.csv.result);
        updateTableData($scope.csv.result);
      }

    } else if ($state.is('admin.subjectMgmt.subjectDetail')) {
      if ($stateParams.subjectId != undefined && $stateParams.subjectId != null && $stateParams.subjectId != "") {
        findSubject($stateParams.subjectId);
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