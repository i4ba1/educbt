'use strict';
angular.module('app.core')
    .controller('QuestionBankImportController', function($scope, $stateParams, $state, queastionBankService, teacherService, storageService, DialogFactory, errorHandle) {

        var currentTeacher;
        var token = '';
        var questionBankId = $stateParams.questionBankId;

        if (!storageService.isAuthorization("EMPLOYEE")) {
            $state.go("login");
        } else {
            currentTeacher = storageService.getLoggedInUser();
            token = storageService.getToken();
        }
        var self = this;
        self.file = null;
        $scope.isPassage = false;

        $scope.questionBanks = [];
        $scope.questions = [];
        $scope.importModel = {
            questionBankName: '',
            questionPoolId: '',
            questionGroupType: 'MC_OR_TF',
            passage: ''
        };

        $scope.isPassageChange = function() {
            if ($scope.isPassage) {
                $scope.importModel.questionGroupType = 'PASSAGE'
            } else {
                $scope.importModel.questionGroupType = 'MC_OR_TF'
            }
        }

        $(document).ready(function() {
            $(":file").filestyle({ input: false, buttonName: 'btn-default', buttonText: 'Pilih Berkas XLS' });
            var element = document.getElementById('xlsFile');
            if (element) {
                element.addEventListener('change', function(e) {
                    self.file = e.target.files[0];
                    console.log(self.file);
                });
            }
        });

        $scope.resultVisible = 0;
        $scope.setVis = function() {
            $scope.resultVisible = 1;
        }

        /*
         * Fetch All Question Bank
         */
        function findQuestionById() {
            var promise = queastionBankService.findQuestionBank(questionBankId, token, currentTeacher.id);
            promise.then(
                function(response) {
                    $scope.importModel.questionBankName = response.data.questionPoolName;
                    $scope.importModel.questionPoolId = response.data.id;
                },
                function(errorResponse) {
                    errorHandle.setError(errorResponse);
                }
            )
        };

        $scope.saveImportData = function() {
            queastionBankService.importQuestionBank(token, self.file, $scope.importModel).then(
                function(response) {
                    $scope.questions = response.data;
                    $scope.resultVisible = 1;
                },
                function(errorResponse) {
                    errorHandle.setError(errorResponse);
                }
            );
        }

        findQuestionById();


    });