'use strict';
angular
  .module('app.core')
  .controller('EventManagementController', function ($scope, $filter, ngTableParams, $stateParams, $state, classService, subjectService, deferredService, queastionBankService, eventService, teacherService, storageService, errorHandle, $timeout, tinyMce, labelFactory, $uibModal, DialogFactory) {

    $scope.currentTeacher;
    var token = " ";
    /*
     * checking authorization
     */
    if (!storageService.isAuthorization("EMPLOYEE")) {
      $state.go("login");
    } else {
      $scope.currentTeacher = storageService.getLoggedInUser();
      token = storageService.getToken();
    }

    $scope.eventImgs = [{
      eventImgName: 'agama',
      label: 'Gambar 1 - Agama'
    }, {
        eventImgName: 'bio',
        label: 'Gambar 2 - Biologi'
      }, {
        eventImgName: 'eco',
        label: 'Gambar 3 -  Ekonomi'
      }, {
        eventImgName: 'eng',
        label: 'Gambar 4 - Bahasa Inggris'
      }, {
        eventImgName: 'fisika',
        label: 'Gambar 5 - Fisika'
      }, {
        eventImgName: 'geo',
        label: 'Gambar 6 - Geografi'
      }, {
        eventImgName: 'ind',
        label: 'Gambar 7 - Bahasa Indonesia'
      }, {
        eventImgName: 'kimia',
        label: 'Gambar 8 - Kimia'
      }, {
        eventImgName: 'mat',
        label: 'Gambar 9 - Matematika'
      }, {
        eventImgName: 'sos',
        label: 'Gambar 10 - Sosiologi'
      }];



    $scope.eventStatusVal = 0;

    $scope.convertLabel = labelFactory.difficultyConverter;

    /*
     * Global / Scope variable
     * All Variable Declared in here first time
     */
    $scope.events = [];
    $scope.eventDetails = [];
    $scope.eventTable = new ngTableParams();
    $scope.questionTable = new ngTableParams();
    $scope.data = null;
    $scope.questionData = null;
    $scope.questionBySubjectList = null;
    $scope.showModal = false;
    $scope.isUpdate = false;
    $scope.selectedEvent = initEvent();
    $scope.eventResult = [];

    $scope.dateShow = {
      start: false,
      end: false,
    };

    $scope.handleDateShow = function (type, value) {
      if ($scope.isPrepared) {
        if (type === "start") {
          $scope.dateShow.start = value
        } else {
          $scope.dateShow.end = value
        }
      }
    };

    function initEvent() {
      var newDate = new Date();
      newDate.setSeconds(0);
      var selectedEvent = {
        eventName: "",
        eventType: "",
        classes: {},
        startDate: newDate,
        endDate: newDate,
        workingTime: "2",
        questionStructure: "RANDOM",
        questions: [],
        status: "PREPARED",
        empId: "",
        eventImgName: ""
      };
      return selectedEvent;
    }


    $scope.isPrepared = true;
    $scope.isCompleted = false;
    $scope.selectedQuestionList = null;

    $scope.subjectData = {
      availableOptions: [],
      selectedOption: undefined
    };

    $scope.classData = {
      availableOptions: [],
      selectedOption: {},
      isSelectAll: false
    };

    $scope.showImage = false;
    $scope.maxTime = 0;
    $scope.getTimeMinutes = function () {
      var mmStart = $scope.selectedEvent.startDate.getTime();
      var mmEnd = $scope.selectedEvent.endDate.getTime();
      if (mmEnd >= mmStart) {
        var deff = mmEnd - mmStart;
        $scope.maxTime = deff / 60000;
      } else {
        $scope.open('md', "E", "Tanggal & waktu tidak valid", ["waktu dimulai harus lebih kecil dari waktu berakhir"], "");
      }
    };

    $scope.trustAsHtml = tinyMce.trustAsHtml;

    $scope.image = function () {
      var result = "";
      if ($scope.selectedEvent.eventImgName != "") {
        result = 'assets/images/thumbnail-tpl/' + $scope.selectedEvent.eventImgName + '_2.png';
        $scope.showImage = true;
      }
      return result;
    }

    /*
     * fetch all event
     */
    function getAllEvent() {
      var promise = deferredService.getPromise(eventService.fetchAllEvent(token, $scope.currentTeacher.nip));
      promise.then(
        function (response) {
          $scope.events = response.data;
        },
        function (error) {
          errorHandle.setError(error);
        }
      ).then(
        function () {
          updateDataTable($scope.events);
        }
        );
    }

    /*
     * fetch all event
     */
    $scope.fetchEventResult = function () {
      $scope.eventResult = [];
      var cId = parseInt($scope.classData.selectedOption);
      var promise = deferredService.getPromise(eventService.fetchEventResult($stateParams.eventId, cId, token));
      promise.then(
        function (response) {
          $scope.eventResult = response.data;
        },
        function (errorResponse) {
          errorHandle.setError(errorResponse);
        });
    };

    /*
     * get event by id
     */
    function getEventById(eventId) {
      var promise = deferredService.getPromise(eventService.findEvent(eventId, token));
      promise.then(
        function (response) {
          $scope.selectedEvent = response.data;
          $scope.selectedEvent.startDate = new Date(response.data.startDate);
          $scope.selectedEvent.endDate = new Date(response.data.endDate);
          $scope.selectedEvent.workingTime = response.data.workingTime.toString();
          $scope.getTimeMinutes();
          if ($scope.selectedEvent.status === "PREPARED") {
            $scope.isPrepared = true;
            $scope.isCompleted = false;
            $scope.eventStatusVal = 0;
          } else if ($scope.selectedEvent.status === "PUBLISHED") {
            $scope.isPrepared = false;
            $scope.isCompleted = false;
            $scope.eventStatusVal = 1;
          } else if ($scope.selectedEvent.status === "RELEASED") {
            $scope.isPrepared = false;
            $scope.isCompleted = false;
            $scope.eventStatusVal = 2;
          } else if ($scope.selectedEvent.status === "COMPLETED") {
            $scope.isPrepared = false;
            $scope.isCompleted = true;
            $scope.eventStatusVal = 3;
          }
        },
        function (error) {
          errorHandle.setError(error);
        });
    }

    /*
     * get class by event id
     */
    function getClassByEventId(eventId) {
      var promise = deferredService.getPromise(classService.fetchClassByEventId(eventId, token));
      promise.then(
        function (response) {
          if ($state.is('teacher.eventManagement.result')) {
            $scope.classData.availableOptions = response.data;
          } else {
            $scope.selectedEvent.classes = [];
            angular.forEach(response.data, function (d) {
              $scope.selectedEvent.classes.push(d.id);
            });
            if ($scope.classData.availableOptions.length == $scope.selectedEvent.classes.length) {
              $scope.classData.isSelectAll = true;
            }
          }
        },
        function (error) {
          errorHandle.setError(error);
        });
    }

    /*
     * get question by event id
     */
    function getQuestionByEventId(eventId) {
      var promise = deferredService.getPromise(queastionBankService.fetchQuestionByEventId(eventId, token));
      promise.then(
        function (response) {
          $scope.subjectData.selectedOption = JSON.stringify(response.data.QP[0].questionPool.subject);
          $scope.selectedEvent.questions = response.data.questions;
        },
        function (error) {
          errorHandle.setError(error);
        })
        .then(
        function () {
          updateDataTable($scope.selectedEvent.questions);
        }
        );
    }

    /*
     * fetch All question by SubjectID to filling reserved question in question bank
     */
    function getAllQuestionBySubject(subjectId) {
      var promise = deferredService.getPromise(queastionBankService.fetchAllQuestionBySubject(subjectId, token, $scope.currentTeacher.nip));
      promise.then(
        function (response) {
          $scope.questionBySubjectList = response.data;
        },
        function (errorResponse) {
          errorHandle.setError(errorResponse);
        }
      ).then(
        function () {
          updateQuestionEventTable($scope.questionBySubjectList);
        }
        );
    }

    /*
     * fetch all subject to fill <select> options in create event
     */
    function getAllSubject() {
      var promise = deferredService.getPromise(subjectService.fetchAllSubject(token));
      promise.then(
        function (response) {
          $scope.subjectData.availableOptions = response.data;
        },
        function (errorResponse) {
          errorHandle.setError(errorResponse);
        }
      );
    };

    /*
     * fetch all Kelas to fill <select option in create event>
     */
    function getAllClass() {
      var promise = deferredService.getPromise(classService.fetchAllClass(token));
      promise.then(
        function (response) {
          $scope.classData.availableOptions = response.data;
        },
        function (errorResponse) {
          errorHandle.setError(errorResponse);
        }
      );
    };

    /*
     * this event active when check box "select all class isChecked or unChecked"
     */
    $scope.classChange = function () {
      $scope.selectedEvent.classes = [];
      if ($scope.classData.isSelectAll) {
        angular.forEach($scope.classData.availableOptions, function (data) {
          $scope.selectedEvent.classes.push(data.id);
        });
      }
    };

    $scope.checkingClass = function () {
      if ($scope.selectedEvent.classes.length == $scope.classData.availableOptions.length && $scope.classData.availableOptions.length > 0) {
        $scope.classData.isSelectAll = true;
      } else {
        $scope.classData.isSelectAll = false;
      }
    }

    /*
     * this event active when button "choose question" in create event was clicked
     * then will update selected question table
     */
    $scope.uploadQuestion = function () {
      $scope.showModal = false;
      updateDataTable($scope.selectedEvent.questions);
    }

    /*
     * this function used for update table in HTML to presentation selected
     * question in create event
     */
    function updateDataTable(data_table) {
      $scope.eventTable = new ngTableParams({
        page: 1,
        count: 10
      }, {
          getData: function ($defer, params) {
            $scope.data = params.sorting() ? $filter('orderBy')(data_table,
              params.orderBy()) : data_table;
            $scope.data = params.filter() ? $filter('filter')($scope.data,
              params.filter()) : $scope.data;
            $scope.data = $scope.data.slice((params.page() - 1) *
              params.count(),
              params.page() * params.count());
            $defer.resolve($scope.data);
          },
          total: data_table.length
        });
    };

    /*
     * this function used for update table in HTML to presentating
     * reserved question in question bank
     */
    function updateQuestionEventTable(data_table) {
      console.log("Data : " + data_table);
      $scope.questionTable = new ngTableParams({
        page: 1,
        count: 10
      }, {
          getData: function ($defer, params) {
            $scope.questionData = params.sorting() ? $filter('orderBy')(data_table,
              params.orderBy()) : data_table;
            $scope.questionData = params.filter() ? $filter('filter')($scope.questionData,
              params.filter()) : $scope.questionData;
            $scope.questionData = $scope.questionData.slice((params.page() - 1) *
              params.count(),
              params.page() * params.count());
            $defer.resolve($scope.questionData);
          },
          total: data_table.length
        });

    };

    /*
     *This Function used save or update
     *SAVING when $scope.isUpdate equal false
     *and UPDATING when $scope.isUpdate equal true
     */
    $scope.saveOrUpdate = function () {
      var promise = null;
      var questionsID = [];
      var events = $scope.selectedEvent;
      events.empId = $scope.currentTeacher.id;
      angular.forEach($scope.selectedEvent.questions, function (data) {
        questionsID.push(data.id);
      });
      events.questions = questionsID;
      var locale = 'id-ID';

      if ($scope.selectedEvent.startDate instanceof Date) {
        events.startDate = $scope.selectedEvent.startDate.getTime();
      } else {
        events.startDate = $scope.selectedEvent.startDate;
      }

      if ($scope.selectedEvent.endDate instanceof Date) {
        events.endDate = $scope.selectedEvent.endDate.getTime();
      } else {
        events.endDate = $scope.selectedEvent.endDate;
      }
      var validData = false;
      var invalidMsg = [];
      // check class data is not empty
      if (events.classes != null && events.classes.length > 0) {
        validData = true;
      } else {
        validData = false;
        invalidMsg.push("kelas belum di pilih");
      }

      if (events.questions != null && events.questions.length > 0) {
        validData = true;
      } else {
        validData = false;
        invalidMsg.push("soal-soal belum di tambahkan")
      }

      if (validData) {
        if ($scope.isUpdate) {
          promise = deferredService.getPromise(eventService.updateEvent(events, token));
          promise.then(
            function (response) {
              $state.go('teacher.eventManagement');
            },
            function (errorResponse) {
              errorHandle.setError(errorResponse);
            }
          );

        } else {
          promise = deferredService.getPromise(eventService.saveEvent(events, token));
          promise.then(
            function (response) {
              $state.go('teacher.eventManagement');
            },
            function (errorResponse) {
              errorHandle.setError(errorResponse);
              if (errorResponse.status === 403) {
                DialogFactory.showDialogMsg('Tambah Ujian Gagal',
                  'Tambah Ujian hanya dapat dibuat satu kali', 'md');
              }
            }
          );
        }
      } else {
        //error here please
        $scope.open('md', "E", "Data tidak valid", invalidMsg, "");
      }
    };

    /*
     * toogle modal in teacher event mgmt to show delete confirmation dialog
     */
    $scope.toggleModal = function (event_data) {
      $scope.showModal = !$scope.showModal;
      $scope.selectedEvent = event_data;
    };

    function initCreateEventPage() {
      getAllSubject();
      getAllClass();
    }

    /*
     * toogle modal in teacher create event to show reserved question
     */
    $scope.toggleModalQuestion = function () {
      if ($scope.subjectData.selectedOption != null && $scope.subjectData.selectedOption != undefined) {
        $scope.showModal = !$scope.showModal;
        var subject = JSON.parse($scope.subjectData.selectedOption);
        getAllQuestionBySubject(subject.id);
      } else {
        $scope.open('md', "E", "Bank soal belum dipilih", ["silahkan pilih bank soal terlebih dahulu!"], "");
      }
    }

    $scope.open = function (size, type, title, messages, content) {
      var template = "";
      if (type == "E") {
        template = 'components/modal-template/error.html';
      } else if (type == "S") {
        template = 'components/modal-template/sucses.html';
      }
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: template,
        controller: 'ModalInstanceCtrl',
        size: size,
        resolve: {
          modalData: function () {
            return {
              title: title,
              messages: messages,
              content: content
            };
          }
        }
      });
    };


    if ($state.is('teacher.eventManagement')) {
      if ($scope.currentTeacher != null) {
        getAllEvent();
      }
    } else if ($state.is('teacher.eventManagement.create')) {
      $scope.isUpdate = false;
      initCreateEventPage();
    } else if ($state.is('teacher.eventManagement.update')) {
      initCreateEventPage();
      $scope.isUpdate = true;
      if ($stateParams.eventId != null && $stateParams.eventId != undefined && $stateParams.eventId != "") {
        getEventById($stateParams.eventId);
        getClassByEventId($stateParams.eventId);
        getQuestionByEventId($stateParams.eventId);
      }
    } else if ($state.is('teacher.eventManagement.result')) {
      if ($stateParams.eventId != null && $stateParams.eventId != undefined && $stateParams.eventId != "") {
        getEventById($stateParams.eventId);
        getClassByEventId($stateParams.eventId);
      }
    }
  });