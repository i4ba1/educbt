(function() {

    'use strict';
    angular.module('app').controller('QuestionBankImportController', QuestionBankImportController);

    QuestionBankImportController.$inject = ['$scope', '$stateParams', '$state', 'queastionBankService', 'teacherService', 'storageService', 'DialogFactory', 'errorHandle', 'bsLoadingOverlayService', '$timeout'];

    function QuestionBankImportController($scope, $stateParams, $state, queastionBankService, teacherService, storageService, DialogFactory, errorHandle, bsLoadingOverlayService, $timeout) {

        var currentTeacher;
        var token = '';
        var questionBankId = $stateParams.questionBankId;

        if (!storageService.isAuthorization("EMPLOYEE")) {
            $state.go("checkroute");
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

        $scope.isPassageChange = function(param) {
            if (param) {
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
            bsLoadingOverlayService.start({
                referenceId: 'loading'
            });
            queastionBankService.importQuestionBank(token, self.file, $scope.importModel).then(
                function(response) {
                    $timeout(function() {
                        bsLoadingOverlayService.stop({
                            referenceId: 'loading'
                        });
                        $scope.questions = response.data;
                        $scope.resultVisible = 1;
                    }, 1500);
                },
                function(errorResponse) {
                    $timeout(function() {
                        bsLoadingOverlayService.stop({
                            referenceId: 'loading'
                        })
                    }, 1500);
                    errorHandle.setError(errorResponse);
                }
            );
        };

        $scope.checkKey = function(key) {
            var result = "";
            if (key) {
                if (key === "true") {
                    result = "BENAR";
                } else if (key === "false") {
                    result = "SALAH";
                } else {
                    result = key;
                }
            } else {
                result = "---";
            }
            return result;
        };

        $scope.checkDiff = function(diff) {
            var result = "";
            if (diff) {
                if (diff === "EASY") {
                    result = "MUDAH";
                } else if (diff === "MEDIUM") {
                    result = "SEDANG";
                } else {
                    result = "SUKAR";
                }
            } else {
                result = "---";
            }
            return result;
        };

        findQuestionById();


    }

})();