'use strict';
angular.module('app.core')
    .controller('QuestionBankImportController', function($scope, $stateParams, $state, queastionBankService, teacherService, storageService, DialogFactory, errorHandle) {

        var currentTeacher;
        var token = '';

        if (!storageService.isAuthorization("EMPLOYEE")) {
            $state.go("login");
        } else {
            currentTeacher = storageService.getLoggedInUser();
            token = storageService.getToken();
        }
        var self = this;
        self.file = null;

        $scope.questionBanks = [];
        $scope.questions = [];
        $scope.importModel = {
            questionPoolId: '',
            questionGroupType: '',
            passage: ''
        };

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
        function findAllQuestionBank() {
            var promise = queastionBankService.fetchAllQuestionBank(token, currentTeacher.nip);
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

        $scope.saveImportData = function() {
            queastionBankService.fetchAllQuestionBank(token, self.file, $scope.importModel, currentTeacher.nip).then(
                function(response) {
                    $scope.questions = response.data;
                    $scope.resultVisible = true;
                },
                function(errorResponse) {
                    errorHandle.setError(errorResponse);
                }
            );
        }

        //findAllQuestionBank();


    });