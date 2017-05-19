(function() {

    'use strict';
    angular
        .module('app.core')
        .controller('QuestionController', QuestionController);

    QuestionController.$inject = ['$scope', '$filter', 'ngTableParams', '$stateParams', '$state', 'storageService', '$http', 'tinyMce', 'subjectService', 'queastionBankService', 'errorHandle', '$sce', 'DialogFactory', '$timeout', 'bsLoadingOverlayService'];

    function QuestionController($scope, $filter, ngTableParams, $stateParams, $state, storageService, $http, tinyMce, subjectService, queastionBankService, errorHandle, $sce, DialogFactory, $timeout, bsLoadingOverlayService) {

        var token = "";
        var type = $stateParams.qType;
        $scope.currentTeacher;
        $scope.title;
        $scope.showAddQst = false;
        $scope.questionUpdate = false;
        $scope.tinymceQuestion = tinyMce.config(200);
        $scope.tinymceOptions = tinyMce.config(100);
        $scope.tinymceExplanation = tinyMce.config(200);
        $scope.isUpdatePassageQ = false;
        $scope.isUpdateMCOption = false;
        $scope.editIndexQuestion = 0;
        $scope.editIndexOption = 0;
        $scope.showModal = false;
        $scope.qPassageType = "";
        $scope.passageQuestions = [];
        $scope.optionModel = "";
        $scope.selectedQuestion = initQst();
        $scope.showModal = false;
        $scope.showModalPassage = false;
        $scope.file;
        $scope.image;
        $scope.imageGalery = [];
        $scope.trustAsHtml = tinyMce.trustAsHtml;
        $scope.images = [];
        $scope.questionGroup;

        if (!storageService.isAuthorization("EMPLOYEE")) {
            $state.go("checkroute");
        } else {
            $scope.currentTeacher = storageService.getLoggedInUser();
            token = storageService.getToken();
        }

        $scope.showEditor = {
            question: false,
            option: false,
            explanation: false,
            panel: false,
            globalValue: false,
            optionA: false,
            optionB: false,
            optionC: false,
            optionD: false,
            optionE: false,
        };

        $scope.qstOptions = initOptionQst("MC");

        function initOptionQst(typeQ) {
            if (typeQ == "TF") {
                return [{
                    'index': 'true',
                    'name': 'Benar'
                }, {
                    'index': 'false',
                    'name': 'Salah'
                }]
            } else {
                return [{
                    'index': "A",
                    'name': 'A'
                }, {
                    'index': "B",
                    'name': 'B'
                }, {
                    'index': "C",
                    'name': 'C'
                }, {
                    'index': "D",
                    'name': 'D'
                }, {
                    'index': "E",
                    'name': 'E'
                }];
            }
        };

        /*
         * used for fill default selectedQuestion value
         */
        function initQst() {
            return {
                'tagNames': [],
                'id': null,
                'question': "",
                'difficulty': null,
                'key': null,
                'explanation': null,
                'optionA': null,
                'optionB': null,
                'optionC': null,
                'optionD': null,
                'optionE': null,
                'typeQuestion': null
            };
        };

        if (type != null) {
            $scope.questionType = type;
            if (type === "MC") {
                $scope.title = "Pilihan Ganda";
                $scope.selectedQuestion.typeQuestion = "MC";
            } else if (type === "TF") {
                $scope.title = "Benar Salah";
                $scope.selectedQuestion.typeQuestion = "TF";
            } else if (type === "MTCH") {
                $scope.title = "Mencocokkan";
            } else if (type === "PASSAGE") {
                $scope.title = "Wacana";
            }
        };

        $scope.tags = {
            'availableOption': [],
            'showTag': true
        };

        $scope.questionGroup = {
            qgType: type,
            globalValue: null,
            questionPoolId: $stateParams.questionBankId,
            questions: []
        }

        // upload images
        $scope.uploadImages = function(questionGroupId) {
            if ($scope.images.length > 0) {
                queastionBankService.uploadImages(token, questionGroupId, $scope.images);
            }
        };

        // open insert images 
        $scope.showImagesPanel = function(tinymceModel) {
            var element = document.querySelectorAll('[ng-model="' + tinymceModel + '"]')[0];

            DialogFactory.openImagesGallery($scope.images, token).then(
                function(response) {
                    $scope.images = response.images;
                    var ed = tinyMCE.get(element.id);
                    var image = ed.getDoc().createElement("img")
                    image.src = response.selectedImage.base64;
                    image.style.cssText = "height:auto; width:250px; max-width:700px;"
                    ed.execCommand('mceInsertContent', false, image.outerHTML);
                },
                function(dismiss) {
                    $scope.images = response.images;
                }
            );
        };



        function findAllGallery() {
            var promise = queastionBankService.findAllGallery(token, $scope.currentTeacher.nip);
            promise.then(function(response) {
                $scope.imageGalery = [];
                angular.forEach(response.data, function(data) {
                    var pathFile = data.pathFile.split('webapps')[1];
                    if (pathFile.indexOf("\\") != (-1)) {
                        pathFile = pathFile.split("\\").join("/");
                    }
                    //var basePath = baseUrl.getUrl().split('/cbt-backend')[0];
                    pathFile = ".." + pathFile;
                    //pathFile = $sce.trustAsResourceUrl(pathFile);
                    $scope.imageGalery.push(pathFile);
                });
            }, function(errorResponse) {
                errorHandle.setError(errorResponse);
            });
        };

        /*
         * Passage Question Add
         */
        $scope.passageQuestionAdd = function(passageQuestion) {
            var result = validatingNormalQuestion(passageQuestion, 0);
            if (result.isValid) {
                if (!$scope.isUpdatePassageQ) {
                    $scope.passageQuestions.push(passageQuestion);
                } else {
                    $scope.passageQuestions[$scope.editIndexQuestion] = passageQuestion;
                    $scope.isUpdatePassageQ = false;
                }
                $scope.selectedQuestion = initQst();
                $scope.qstOptions = [];
                $scope.showAddQst = false;
            } else {
                DialogFactory.showDialogMsg('Gagal Simpan', result.message, 'md')
            }

        };

        /*
         * Passage Question remove
         */
        $scope.passageQuestionRemove = function(index) {
            $scope.passageQuestions.splice(index, 1);
        };

        /*
         * Passage Question edit
         */
        $scope.passageQuestionEdit = function(question, index) {
            findAll().then(function() {
                $scope.isUpdatePassageQ = true;
                $scope.selectedQuestion = question;
                $scope.showAddQst = true;
                $scope.qPassageType = question.typeQuestion;
                $scope.editIndexQuestion = index;
                if (question.typeQuestion == 'MC') {
                    $scope.qstOptions = initOptionQst("MC");
                } else if (question.typeQuestion == 'TF') {
                    $scope.qstOptions = initOptionQst("TF");
                }
                if ($scope.tags.availableOption.length > 0 && $scope.selectedQuestion.tagNames.length > 0) {
                    for (var i = 0; i < $scope.selectedQuestion.tagNames.length; i++) {
                        var data = $scope.selectedQuestion.tagNames[i];
                        $scope.tags.availableOption.splice($scope.tags.availableOption.findIndex(d => d.tagName === data.tagName), 1);
                        console.log("available option" + $scope.tags.availableOption.length);
                    };
                }
            });
        };

        /*
         *fetch all tags in current teacher
         */
        function findAll() {
            var promise = subjectService.fetchAllChapterByTeachIdAndSubjectId($scope.currentTeacher.id, token, $stateParams.subjectId);
            promise.then(
                function(response) {
                    $scope.tags.availableOption = [];
                    angular.forEach(response.data, function(data) {
                        $scope.tags.availableOption.push({
                            'id': data.id,
                            'tagName': data.tagName
                        })
                    });
                },
                function(errorResponse) {
                    errorHandle.setError(errorResponse);
                });

            return promise;
        };

        /*
         * fetch all question from qstGroup and show detail qstGroup
         */
        function findQuestionGroupDetail() {
            bsLoadingOverlayService.start({
                referenceId: 'loading'
            });
            var promise = queastionBankService.detailQuestionGroup($stateParams.qId, token);
            promise.then(
                function(response) {
                    $scope.questionGroup = response.data.questionGroup[0];
                    $scope.images = response.data.images;
                    if (type == "PASSAGE") {
                        $scope.passageQuestions = $scope.questionGroup.questions;
                    } else {
                        $scope.selectedQuestion = $scope.questionGroup.questions[0];
                        if ($scope.tags.availableOption.length > 0 && $scope.selectedQuestion.tagNames.length > 0) {
                            for (var i = 0; i < $scope.selectedQuestion.tagNames.length; i++) {
                                var data = $scope.selectedQuestion.tagNames[i];
                                $scope.tags.availableOption.splice($scope.tags.availableOption.findIndex(d => d.tagName === data.tagName), 1);
                            };
                        }
                        if (type == "MC") {
                            $scope.qstOptions = initOptionQst("MC");
                        }
                    }
                    $timeout(function() {
                        bsLoadingOverlayService.stop({
                            referenceId: 'loading'
                        });
                    }, 1500);
                },
                function(errorResponse) {
                    bsLoadingOverlayService.stop({
                        referenceId: 'loading'
                    });
                    errorHandle.setError(errorResponse);
                });
        };

        $scope.showPanel = function(value, value_2) {
            findAll();
            $scope.selectedQuestion = initQst();
            $scope.selectedQuestion.typeQuestion = value_2;
            $scope.qPassageType = value_2;

            if (value_2 == 'MC') {
                $scope.qstOptions = initOptionQst("MC")
            } else if (value_2 == 'TF') {
                $scope.qstOptions = initOptionQst("TF")
            }

            $scope.showAddQst = value;
            $scope.showModalPassage = false;

        }

        $scope.addTag = function(tagStr) {
            if (tagStr != '') {
                var tag = JSON.parse(tagStr);
                $scope.selectedQuestion.tagNames.push(tag);
                $scope.tags.availableOption.splice($scope.tags.availableOption.findIndex(t => t.tagName === tag.tagName), 1);
            }
            $scope.tags.showTag = true;
        };

        $scope.deleteTag = function(index) {
            $scope.tags.availableOption.push($scope.selectedQuestion.tagNames[index]);
            $scope.selectedQuestion.tagNames.splice(index, 1);
        };

        // Saving Question 
        $scope.saveQuestion = function() {
            var result = {};
            if (type === "MC" || type === "TF") {
                result = validatingNormalQuestion($scope.selectedQuestion, 0);
                if (result.isValid) {
                    if ($scope.questionUpdate) {
                        $scope.questionGroup.questions[0] = $scope.selectedQuestion;
                    } else {
                        $scope.questionGroup.questions.push($scope.selectedQuestion);
                    }
                }

            } else if (type === "PASSAGE") {
                $scope.questionGroup.questions = $scope.passageQuestions;
                result = validatingPassageQuestion($scope.questionGroup);

            }
            bsLoadingOverlayService.start({
                referenceId: 'loading'
            });
            if (result.isValid) {
                if ($scope.questionUpdate) {
                    var promise = queastionBankService.updateQuestionGroup(token, $scope.questionGroup);
                    promise.then(function(response) {
                        $scope.uploadImages($stateParams.qId);
                        $timeout(function() {
                            bsLoadingOverlayService.stop({
                                referenceId: 'loading'
                            });
                            $state.go("^");
                        }, 2000);
                    }, function(errorResponse) {
                        bsLoadingOverlayService.stop({
                            referenceId: 'loading'
                        });
                        errorHandle.setError(errorResponse);
                    });
                } else {
                    var promise = queastionBankService.createQuestionGroup(token, $scope.questionGroup);
                    promise.then(function(response) {
                        $scope.uploadImages(response.data.id);
                        $timeout(function() {
                            bsLoadingOverlayService.stop({
                                referenceId: 'loading'
                            });
                            $state.go("^");
                        }, 2000);
                    }, function(errorResponse) {
                        bsLoadingOverlayService.stop({
                            referenceId: 'loading'
                        });
                        errorHandle.setError(errorResponse);
                    });
                }
            } else {
                bsLoadingOverlayService.stop({
                    referenceId: 'loading'
                });
                DialogFactory.showDialogMsg('Gagal Simpan', result.message, 'md');
            }


        };

        //form validating for create or updating passage question 
        function validatingPassageQuestion(group) {
            var messageBuilder = "<p style='text-align:left; font-size:10pt;'>";
            var errorCounter = 0;
            var QCheckAble = true;
            var elementId = document.querySelectorAll('[ng-model="questionGroup.globalValue"]')[0].id;
            var element = tinyMCE.get(elementId).getContent();
            var isValid = true;
            if (!element) {
                errorCounter++;
                messageBuilder = messageBuilder.concat(errorCounter + " . Wacana tidak boleh kosong <br/>");
                isValid = false;
            }
            if (group.questions.length === 0) {
                errorCounter++;
                messageBuilder = messageBuilder.concat(errorCounter + " . Daftar Soal tidak boleh kosong, minimal ada 1 soal. <br/>");
                QCheckAble = false;
                isValid = false;
            }
            messageBuilder = messageBuilder.concat('</p>');
            return {
                isValid: isValid,
                message: messageBuilder
            };
        }

        function validatingNormalQuestion(q, ec) {
            var messageBuilder = "<p style='text-align:left; font-size:10pt;'>";
            var isValid = true;

            if (q.tagNames.length === 0) {
                ec++;
                messageBuilder = messageBuilder.concat(ec + " . Sub Materi tidak boleh kosong <br/>");
                isValid = false;
            }

            if (!q.question) {
                ec++;
                messageBuilder = messageBuilder.concat(ec + " . Pertanyaan tidak boleh kosong <br/>");
                isValid = false;
            }

            if (!q.key) {
                ec++;
                messageBuilder = messageBuilder.concat(ec + " . Kunci Jawab tidak boleh kosong <br/>");
                isValid = false;
            }

            if (!q.explanation) {
                ec++;
                messageBuilder = messageBuilder.concat(ec + " . Pembahasan tidak boleh kosong <br/>");
                isValid = false;
            }

            if (q.typeQuestion === "MC") {
                if (!q.optionA) {
                    ec++;
                    messageBuilder = messageBuilder.concat(ec + " . Pilihan A tidak boleh kosong <br/>");
                    isValid = false;
                }
                if (!q.optionB) {
                    ec++;
                    messageBuilder = messageBuilder.concat(ec + " . Pilihan B tidak boleh kosong <br/>");
                    isValid = false;
                }
                if (!q.optionC) {
                    ec++;
                    messageBuilder = messageBuilder.concat(ec + " . Pilihan C tidak boleh kosong <br/>");
                    isValid = false;
                }

            }
            if (!q.difficulty) {
                ec++;
                messageBuilder = messageBuilder.concat(ec + " . Taraf Kesukaran tidak boleh kosong <br/>");
                isValid = false;
            }
            messageBuilder = messageBuilder.concat('</p>');
            return {
                isValid: isValid,
                message: messageBuilder
            }
        }


        if ($stateParams.qId != null && $stateParams.qId != "") {
            $(document).ready(function() {
                findAll();
                findQuestionGroupDetail();
            })
            $scope.questionUpdate = true;
        } else {
            findAll();
        }

    }

})();