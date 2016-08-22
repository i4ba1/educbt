angular.module('app.core')
  .controller('StudentExamController', function($scope, $stateParams, $timeout, queastionBankService, studentService, deferredService, eventService, studentExamService, $state, storageService, errorHandle, tinyMce, DialogFactory) {

    var currentStudent;
    var token = " ";
    $scope.selectedStudent = "";
    $scope.selectedEvent = {};
    $scope.eventQuestions = [];

    $scope.listAnswer = [];
    $scope.selectedAns = [];
    $scope.currentIndex = 0;
    $scope.keys = [];
    $scope.max = 0;
    $scope.studentAnswers = [];
    $scope.isExam = true;
    $scope.point = 0;
    $scope.timeWorking = 0;

    $scope.trustAsHtml = tinyMce.trustAsHtml;
    $scope.currentQuestion = {
      answered: null,
      correct: false,
      event: null,
      id: null,
      question: {}
    };

    $scope.convertAnsweer = function(value) {
      if (value === "false") {
        return " F";
      } else if (value === "true") {
        return " T"
      } else {
        return value;
      }
    }




    /*
     *
     */
    function fetchStudentAnswer(eventId, nis) {
      var promise = deferredService.getPromise(studentExamService.fetchStudentAnswer(eventId, nis, token));
      promise.then(
          function(response) {
            $scope.studentAnswers = response.data;
          },
          function(errorResponse) {
            errorHandle.setError(errorResponse);
          })
        .then(function() {
          updateQuestion();
          $scope.max = $scope.studentAnswers.length - 1;
        });
    };

    function countPoint(data) {
      var counter = 0;
      angular.forEach(data, function(d) {
        if (d.correct) {
          counter = counter + 1;
        }
      });
      $scope.point = (counter * 100 / data.length);
    }

    /*
     *
     */
    function fetchStudentExplanation(eventId, nis) {
      var promise = deferredService.getPromise(studentExamService.fetchStudentExplanation(eventId, nis, token));
      promise.then(
          function(response) {
            $scope.studentAnswers = response.data;
          },
          function(errorResponse) {
            errorHandle.setError(errorResponse);
          })
        .then(
          function() {
            updateQuestion();
            $scope.max = $scope.studentAnswers.length - 1;
            countPoint($scope.studentAnswers);
          }
        );
    };


    $scope.updateAnswer = function() {
      if ($scope.currentQuestion != null && $scope.currentQuestion != undefined) {
        var params = [{
          'authorization': token,
          'studentAnswer': {
            'id': $scope.currentQuestion.id,
            'ans': $scope.currentQuestion.answered
          }
        }];
        var promise = deferredService.getPromise(studentExamService.updateStudentAnswer(params));
        promise.then(function(response) {}, function(errorResponse) {});
      }
    };

    /*
     * get event by id
     */
    function findEvent(eventId) {
      var promise = deferredService.getPromise(eventService.findEvent(eventId, token));
      promise.then(
          function(response) {
            $scope.selectedEvent = response.data;
            if ($scope.isExam) {
              startTimer($scope.selectedEvent.workingTime);
            }
          },
          function(error) {
            errorHandle.setError(error);
          })
        .then(function() {
          updateQuestion();
        });
    }

    /*
     * get question by event id
     */
    function fetchQuestionByEventId() {
      var eventId = $stateParams.eventId;
      if (eventId != undefined && eventId != null) {
        var promise = deferredService.getPromise(queastionBankService.fetchQuestionByEventId(eventId, token));
        promise.then(
          function(response) {
            $scope.eventQuestions = response.data;
          },
          function(errorResponse) {
            errorHandle.setError(errorResponse);
          });
      }
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
        },
        function(errorResponse) {
          errorHandle
        }
      );
    };

    $scope.questionType = "";

    function updateQuestion() {
      $scope.currentQuestion = $scope.studentAnswers[$scope.currentIndex];
      if ($scope.currentQuestion != undefined) {
        $scope.questionType = $scope.currentQuestion.question.typeQuestion;
      }
    }

    $scope.nextSlide = function() {
      console.log("entering here");
      if ($scope.currentIndex <= $scope.studentAnswers.length - 1) {
        $scope.currentIndex = $scope.currentIndex + 1;
        updateQuestion();
      }
    };

    $scope.prevSlide = function() {
      console.log("Prev Slide=> " + $scope.currentIndex);
      if ($scope.currentIndex >= 0) {
        $scope.currentIndex = $scope.currentIndex - 1;
        updateQuestion();
      }
    };

    /**
    Handling the direct clicked from list of answered questions
    */
    $scope.currentSlide = function(idx) {
      console.log("idx===> " + idx);
      $scope.currentIndex = idx - 1;
      updateQuestion();
    };

    $scope.counter = 0;
    $scope.timeWorking = null;
    $scope.onTimeout = function() {

      $scope.counter--;
      $scope.timeWorking = new Date(0, 0, 0).setSeconds($scope.counter);
      if ($scope.counter > 0) {
        mytimeout = $timeout($scope.onTimeout, 1000);
      } else {
        DialogFactory.showDialogMsg("Ujian Selesai", "Waktu Telah Habis", "md");
        $timeout.cancel($scope.onTimeout);
        $state.go('student.task.exam.result');
      }
    }

    function startTimer(time) {
      $scope.counter = time * 60;
      $timeout($scope.onTimeout, 1000);
    }

    /*
     * checking authorization
     */
    if (!storageService.isAuthorization("STUDENT")) {
      $state.go("login");
    } else {
      currentStudent = storageService.getLoggedInUser();
      token = storageService.getToken();
      findStudent(currentStudent.nis);
      findEvent($stateParams.eventId);
    }

    if ($state.is('student.task.exam')) {
      $scope.isExam = true;
      fetchStudentAnswer($stateParams.eventId, currentStudent.nis);
    } else if ($state.is('student.task.explanation')) {
      $scope.isExam = false;
      fetchStudentExplanation($stateParams.eventId, currentStudent.nis);
    }

  });
