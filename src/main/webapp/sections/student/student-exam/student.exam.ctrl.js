angular.module('app.core')
    .controller('StudentExamController', function($scope, $stateParams, $timeout, queastionBankService, studentService, eventService, studentExamService, $state, storageService, errorHandle, tinyMce, DialogFactory, $window) {

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
        $scope.studentEventTime = { id: null };
        $scope.redirect = false;
        $scope.lastTimeout;

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
            var promise = studentExamService.fetchStudentAnswer(eventId, nis, token);
            promise.then(
                    function(response) {
                        $scope.studentAnswers = [];
                        angular.forEach(response.data, function(d) {
                            d.question.key = d.question.key.split("#")[1];
                            $scope.studentAnswers.push(d);
                        });
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
            var promise = studentExamService.fetchStudentExplanation(eventId, nis, token);
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
                var promise = studentExamService.updateStudentAnswer(params);
                promise.then(function(response) {
                    saveLastWorkingTime({ "message": "reloadEvent", "type": "update", "id": $scope.studentEventTime.id });
                }, function(errorResponse) {

                });
            }
        };

        /*
         * get event by id
         */
        function findEvent(eventId) {
            var promise = eventService.findEvent(eventId, token);
            promise.then(
                    function(response) {
                        $scope.selectedEvent = response.data;
                        if ($scope.isExam) {

                            findLastWorkingTime($scope.selectedEvent.workingTime);
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
                var promise = queastionBankService.fetchQuestionByEventId(eventId, token);
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
            var promise = studentService.findStudent(nis, token);
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
            if ($scope.counter === 300) {
                DialogFactory.showReminderMsg("Peringatan", "5 menit lagi waktu akan habis", "md");
                var timeout = $timeout($scope.onTimeout, 1000);
                $timeout.cancel($scope.lastTimeout);
                $scope.lastTimeout = timeout;
                angular.element('#working-time').css('color', 'red');
                angular.element('#working-time').css('font-weight', 'bold');
            } else if ($scope.counter > 0) {
                var timeout = $timeout($scope.onTimeout, 1000);
                $timeout.cancel($scope.lastTimeout);
                $scope.lastTimeout = timeout;
            } else {
                DialogFactory.showDialogMsg("Ujian Selesai", "Waktu Telah Habis", "md");
                $timeout.cancel($scope.lastTimeout);
                $scope.redirect = true;
                $state.go('student.task.exam.result');
            }
        }

        function startTimer(time) {
            $scope.counter = time;
            var timeout = $timeout($scope.onTimeout, 1000);
            $scope.lastTimeout = timeout;
        }

        $scope.finishExamintion = function() {
            $timeout.cancel($scope.lastTimeout);
            $scope.redirect = true;
            $state.go('student.task.exam.result');
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

        $window.onbeforeunload = function() {
            if ($state.is('student.task.exam')) {
                saveLastWorkingTime({ "message": "reloadEvent", "type": "update", "id": $scope.studentEventTime.id });
            }
        }

        $scope.$on('$stateChangeStart', function(event, scope, next, current) {
            // saveLastWorkingTime({ "message": "backButtonEvent", "type": "update", "id": $scope.studentEventTime.id });
            if ($state.is("student.task.exam") && !$scope.redirect) {
                event.preventDefault();
            }

            if ($state.is("student.task.exam") && !$scope.redirect) {
                var result = DialogFactory.confDialogMsg(
                    "Pemberitahuan",
                    "Apakah anda ingin menyelesaikan ujian ini ?",
                    "md");

                result.then(
                    function(value) {
                        if (value) {
                            $timeout.cancel($scope.lastTimeout);
                            $scope.redirect = true;
                            $state.go('student.task.exam.result');
                        } else {
                            event.preventDefault();
                        }
                    },
                    function(error) {

                    }
                );
            }


        });

        function saveLastWorkingTime(param) {
            console.log(param.message);
            var params = [];
            if (param.type === "save") {
                params = [{
                    'authorization': token,
                    'eventId': $stateParams.eventId,
                    'studentId': currentStudent.nis,
                    'lastUpdatedTime': ($scope.selectedEvent.workingTime * 60)
                }];
            } else {
                params = [{
                    'authorization': token,
                    'id': param.id,
                    'lastUpdatedTime': $scope.counter
                }];
            }

            var promise = studentExamService.saveOrUpdateTime(params);
            promise.then(
                function(response) {
                    if (param.message === "backButtonEvent") {
                        $timeout.cancel($scope.lastTimeout);
                    }
                },
                function(errorResponse) {

                }
            );
        }

        function findLastWorkingTime(timeParam) {
            var promise = studentExamService.findLastWorkingTime($stateParams.eventId, currentStudent.nis, token);
            promise.then(
                function(response) {
                    $scope.studentEventTime = response.data;
                    startTimer($scope.studentEventTime.lastUpdatedTime);
                },
                function(errorResponse) {
                    if (errorResponse.status === 404) {
                        saveLastWorkingTime({ "message": "init student working time", "type": "save", "id": null });
                        startTimer(timeParam * 60);
                    }
                }
            );
        }

    });