'use strict';
angular
    .module('app')
    .controller('QuestionsBankController', function($scope, $filter, ngTableParams, $stateParams, $state, queastionBankService, subjectService, teacherService, storageService, errorHandle, $http, $timeout, tinyMce, DialogFactory) {

        $scope.currentTeacher;
        var token = " ";

        /*
         * checking authorization
         */
        if (!storageService.isAuthorization("EMPLOYEE")) {
            $state.go("checkroute");
        } else {
            $scope.currentTeacher = storageService.getLoggedInUser();
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

        $scope.questionBankTable = new ngTableParams();
        $scope.data = [];
        $scope.questionBanks = [];
        $scope.subjectData = {
            availableOptions: [],
            selectedOption: {}
        };
        $scope.updateQP = false;
        $scope.selectedTeacher = null;
        $scope.selectedQuestionBank = {
            "questionPoolName": "",
            'subject': {},
            'questions': [],
            'teacherId': $scope.currentTeacher.id
        };
        $scope.showModal = false;
        $scope.selectedQuestion = {};
        $scope.isUpdateQuestion = false;
        $scope.selectedQuestionGroup;


        $scope.getQGType = function(qgType) {
            if (qgType === "MC") {
                return "Soal Tunggal - Pilihan Ganda";
            } else if (qgType === "TF") {
                return "Soal Tunggal - Benar Salah";
            } else if (qgType === "PASSAGE") {
                return "Soal Wacana";
            }
        };


        /*
         * Fetch All Question Bank
         */
        function findAllQuestionBank() {
            var promise = queastionBankService.fetchAllQuestionBank(token, $scope.currentTeacher.nip);
            promise.then(
                function(response) {
                    $scope.questionBanks = response.data;
                },
                function(errorResponse) {
                    errorHandle.setError(errorResponse);
                }
            ).then(
                function() {
                    updateDataTable($scope.questionBanks);
                });
        };

        /*
         * fetching all question by QuestionPoolId to showing detail of Question Pool
         */
        function fetchAllQuestion(id) {
            var promise = queastionBankService.fetchAllQuestion(id, token);
            promise.then(
                function(response) {
                    updateDataTable(response.data);
                },
                function(errorResponse) {
                    errorHandle.setError(errorResponse);
                });
        }

        $scope.trustAsHtml = tinyMce.trustAsHtml;

        /*
         * fetching all question by QuestionPoolId to showing detail of Question Pool
         */
        function detailQuestionPool(id) {
            var promise = queastionBankService.detailQuestionPool(id, token, $scope.currentTeacher.nip);
            promise.then(
                    function(response) {
                        $scope.questionBanks = response.data;
                    },
                    function(errorResponse) {
                        errorHandle.setError(errorResponse);
                    })
                .then(function() {
                    updateDataTable($scope.questionBanks);
                });
        }

        /*
         * find Question Pool by Question Pool Id to show detail of question pool
         */
        function findQuestionBank(id) {
            var promise = queastionBankService.findQuestionBank(id, token);
            promise.then(
                function(response) {
                    $scope.selectedQuestionBank = response.data;
                    $scope.selectedQuestionBank.subject.id = $scope.selectedQuestionBank.subject.id.toString();
                },
                function(errorResponse) {
                    errorHandle.setError(errorResponse);
                }
            );
        };


        /*
         * get All subject to filling <select> option when importing question in Question Pool Event
         */
        function findAllSubject() {
            subjectService.fetchAllSubject(token).then(
                function(response) {
                    $scope.subjectData.availableOptions = response.data;
                },
                function(errorResponse) {
                    errorHandle.setError(errorResponse);
                }
            );
        };

        /*
         * used for editng selectedQuestion by Question ID
         */
        function findQuestion(id) {
            var promise = queastionBankService.findQuestion(id, token);
            promise.then(
                function(response) {
                    $scope.selectedQuestion = response.data;
                },
                function(errorResponse) {
                    errorHandle.setError(errorResponse);
                }

            );
        };

        /*
         * Import All Question Bank
         */
        $scope.importQuestionBank = function() {
            var promise = queastionBankService.importQuestionBank($scope.selectedQuestionBank, token);
            promise.then(
                function(response) {
                    $state.go('teacher.questionBank');
                },
                function(errorResponse) {
                    errorHandle.setError(errResponse);
                }
            );
        };

        /*
         * used for showing question Pool data
         */
        function updateDataTable(data_table) {
            $scope.questionBankTable = new ngTableParams({
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
         * used for showing delete confirmation selectedQuestionBank
         */
        $scope.toggleModal = function(questionBank) {
            $scope.showModal = !$scope.showModal;
            $scope.selectedQuestionBank = questionBank;
        };

        /*
         * used for showing delete confirmation selectedQuestion
         */
        $scope.toggleModalQuestion = function(question) {
            $scope.showModal = !$scope.showModal;
            $scope.selectedQuestion = question;
        };

        $scope.toggleModalQuestionGroup = function(qGroup) {
            $scope.showModal = !$scope.showModal;
            $scope.selectedQuestionGroup = qGroup;
        };

        $scope.deleteQuestionGroup = function() {
            var id = $scope.selectedQuestionGroup.id;
            queastionBankService.deleteQuestionGroup(id, token)
                .then(function(response) {
                    $scope.data.splice($scope.data.findIndex(group => group.id === id), 1);
                    $scope.questionBanks.splice($scope.questionBanks.findIndex(group => group.id === id), 1);
                    $scope.showModal = false;
                }, function(errorResponse) {
                    errorHandle.setError(errResponse);
                });
        }

        /*
         * used for showing delete confirmation selectedQuestion
         */
        $scope.showModalQuestionType = false;

        $scope.submitQuestionType = function(questionType) {
            $timeout(function() {
                $scope.showModalQuestionType = false;
            }, 250);
            $timeout(function() {
                $state.go('teacher.questionBank.qpdetail.qCreateOrUpdate', {
                    "qType": questionType,
                    "subjectId": $scope.selectedQuestionBank.subject.id
                });
            }, 250);
        };

        $scope.editQstGroup = function(qGroup) {
            $state.go('teacher.questionBank.qpdetail.qCreateOrUpdate', {
                "qType": qGroup.qgType,
                "qId": qGroup.id
            });
        };

        /*
         *This Function used save or update
         *SAVING when $scope.isUpdate equal false
         *and UPDATING when $scope.isUpdate equal true
         */
        $scope.saveOrUpdate = function() {
            var promise = null;
            if ($scope.isUpdateQuestion) {
                $scope.selectedQuestion.questionPool = {};
                promise = queastionBankService.updateQuestion($scope.selectedQuestion, token);
                promise.then(
                    function(response) {
                        $state.go('teacher.questionBank.qpdetail');
                    },
                    function(errorResponse) {
                        errorHandle.setError(errorResponse);
                    }
                );
            }
        };

        /*
         * used for delete selected Question by questionID
         */
        $scope.deleteQuestion = function() {
            var promise = queastionBankService.deleteQuestion($scope.selectedQuestion.id, token);
            promise.then(
                function(response) {
                    $scope.showModal = false;
                    fetchAllQuestion($scope.selectedQuestionBank.id);
                },
                function(errorResponse) {
                    errorHandle.setError(errorResponse);
                }
            );
        };

        /*
         * used for delete selected Question Pool
         */
        $scope.deleteQuestionBank = function() {
            var promise = queastionBankService.deleteQuestionBank($scope.selectedQuestionBank.id, token);
            promise.then(
                function(response) {
                    $scope.showModal = false;
                    findAllQuestionBank();
                },
                function(errorResponse) {
                    errorHandle.setError(errorResponse);
                }
            );
        };

        /*
         * used for create Question Pool
         */
        $scope.createQuestionPool = function() {
            var promise;
            if ($scope.updateQP) {
                promise = queastionBankService.updateQuestionBank($scope.selectedQuestionBank, token);
            } else {
                promise = queastionBankService.createQuestionPool(token, $scope.selectedQuestionBank);
            }
            promise.then(
                function(response) {
                    $state.go("^");
                },
                function(errorResponse) {
                    errorHandle.setError(errorResponse);
                    if (errorResponse.status === 403) {
                        DialogFactory.showDialogMsg('Tambah Bank Soal Gagal',
                            'Bank Soal hanya dapat dibuat sebanyak lima kali', 'md');
                    }
                }
            );
        };

        if ($state.is('teacher.questionBank')) {
            if ($scope.currentTeacher != null) {
                findAllQuestionBank();
            }

        } else if ($state.is('teacher.questionBank.import')) {
            findAllSubject();
            $scope.download = function(resource) {
                window.open(resource);
            }

            $scope.updateData = function() {
                $scope.data = $scope.csv.result;
                $scope.selectedQuestionBank.subjectId = $scope.subjectData.selectedOption.id;
                $scope.selectedQuestionBank.questions = $scope.csv.result;
                $scope.selectedQuestionBank.teacherId = $scope.currentTeacher.id;
                updateDataTable($scope.csv.result);
            }

        } else if ($state.is('teacher.questionBank.qpdetail.qdetail')) {
            if ($stateParams.questionId != undefined && $stateParams.questionId != null && $stateParams.questionId != "") {
                findQuestion($stateParams.questionId);
                $scope.isUpdateQuestion = true;
            } else {
                $scope.isUpdateQuestion = false;
            }
        } else if ($state.is('teacher.questionBank.qpdetail')) {
            if ($stateParams.questionBankId != undefined && $stateParams.questionBankId != null && $stateParams.questionBankId != "") {
                detailQuestionPool($stateParams.questionBankId);
                findQuestionBank($stateParams.questionBankId);
            }
        } else if ($state.is('teacher.questionBank.create')) {
            if ($stateParams.questionBankId != undefined && $stateParams.questionBankId != null && $stateParams.questionBankId != "") {
                findQuestionBank($stateParams.questionBankId);
                $scope.updateQP = true;
            } else {
                $scope.updateQP = false;
                findAllSubject();
            }

        }
    });