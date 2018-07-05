(function() {

    'use strict';
    angular.module('app').controller('StudentExamController', StudentExamController);

    StudentExamController.$inject = ['$scope', '$stateParams', '$timeout', 'queastionBankService', 'studentService', 'eventService', 'studentExamService', '$state', 'storageService', 'errorHandle', 'tinyMce', 'DialogFactory', '$window'];

    function StudentExamController($scope, $stateParams, $timeout, queastionBankService, studentService, eventService, studentExamService, $state, storageService, errorHandle, tinyMce, DialogFactory, $window) {

        var currentStudent;
        var token = " ";
        $scope.selectedStudent = "";
        $scope.selectedEvent = {};
        $scope.eventQuestions = [];
        $scope.configuration = {
            selector: 'textarea',
            height: 200,
            menubar: '',
            plugins: [
                'advlist autolink lists link image charmap print preview hr anchor pagebreak',
                'searchreplace wordcount visualblocks visualchars code fullscreen',
                'insertdatetime media nonbreaking save table contextmenu directionality',
                'emoticons template paste textcolor colorpicker textpattern imagetools tiny_mce_wiris'
            ],
            toolbar: $state.is("student.task.exam") ? 'bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | tiny_mce_wiris_formulaEditor' : false,
            image_advtab: true,
            resize: false,
            setup: function(e) {
                e.on('blur', function() {
                    // Get the raw contents of the currently active editor
                    var content = tinyMCE.activeEditor.getContent({ format: 'raw' });
                    $scope.updateAnswer(content);
                });

            },
            statusbar: false,
            images_dataimg_filter: function(img) {
                return img.hasAttribute('internal-blob');
            },
            readonly: $state.is("student.task.exam") ? 0 : 1
        };

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
        $scope.examProgress = getProgress();

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
         * checking authorization
         */
        if (!storageService.isAuthorization("STUDENT")) {
            $state.go("checkroute");
        } else {
            currentStudent = storageService.getLoggedInUser();
            token = storageService.getToken();
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
                    $scope.examProgress = getProgress();
                });
        };

        // function countPoint(data) {
        //     var counter = 0;
        //     angular.forEach(data, function(d) {
        //         if (d.correct) {
        //             counter = counter + 1;
        //         }
        //     });
        //     $scope.point = (counter * 100 / data.length);
        // }

        /*
         *
         */
        function fetchStudentExplanation(eventId, nis) {
            var promise = studentExamService.fetchStudentExplanation(eventId, nis, token);
            promise.then(
                    function(response) {
                        $scope.studentAnswers = response.data.listStudentAnswer;
                        $scope.point = response.data.eventResult.total;
                    },
                    function(errorResponse) {
                        errorHandle.setError(errorResponse);
                    })
                .then(
                    function() {
                        updateQuestion();
                        $scope.max = $scope.studentAnswers.length - 1;
                        $scope.examProgress = getProgress();
                    }
                );
        };

        function getProgress() {
            var answerCount = 0;
            $scope.studentAnswers.forEach(function(element) {
                if (element.answered) {
                    answerCount++;
                }
            });
            return answerCount + "/" + $scope.studentAnswers.length;
        }


        $scope.updateAnswer = function(param) {
            if ($state.is('student.task.exam')) {

                if (param) {

                    $scope.currentQuestion.answered = param;

                    $scope.examProgress = getProgress();
                }
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
            var result = DialogFactory.confDialogMsg(
                "Pemberitahuan",
                "Apakah anda ingin menyelesaikan ujian ini ?",
                "md");
            result.then(
                function(finishExam) {
                    if (finishExam) {
                        $timeout.cancel($scope.lastTimeout);
                        $scope.redirect = true;
                        $state.go('student.task.exam.result');
                    } else {
                        event.preventDefault();
                    }

                },
                function(notYet) {}
            );
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

        /**
         * 
         * get find last working time if there are any working time, 
         * timer will set by that if not timer will be set using time param
         * 
         * */
        function findLastWorkingTime(timeParam) {
            var remainingTime = 0;
            var promise = studentExamService.findLastWorkingTime($stateParams.eventId, currentStudent.nis, token);
            promise.then(
                function(response) {
                    $scope.studentEventTime = response.data;
                    remainingTime = calculateRemainingTime($scope.studentEventTime.lastUpdatedTime);
                    startTimer(remainingTime);
                },
                function(errorResponse) {
                    if (errorResponse.status === 404) {
                        saveLastWorkingTime({ "message": "init student working time", "type": "save", "id": null });
                        remainingTime = remainingTime = calculateRemainingTime(timeParam * 60);
                        startTimer(remainingTime);
                    }
                }
            );
        }

        function calculateRemainingTime(lastTime) {
            var remainingTime = 0;
            var currentTimeExam = new Date().getTime();
            var endTimeExam = $scope.selectedEvent.endDate;
            var timeDeviation = (endTimeExam - currentTimeExam) / 1000;

            if (timeDeviation >= lastTime) {
                remainingTime = lastTime;
            } else {
                remainingTime = timeDeviation;
            }

            return remainingTime;
        }

    }
})();