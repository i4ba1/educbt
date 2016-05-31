'use strict';
angular
  .module('app.core')
  .controller('QuestionController', function($scope, $filter, ngTableParams, $stateParams, $state, storageService, $http, tinyMce, subjectService, deferredService, queastionBankService, errorHandle, baseUrl) {

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

    if (!storageService.isAuthorization("EMPLOYEE")) {
      $state.go("login");
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
          'index': 'A',
          'name': 'A'
        }, {
          'index': 'B',
          'name': 'B'
        }, {
          'index': 'C',
          'name': 'C'
        }, {
          'index': 'D',
          'name': 'D'
        }, {
          'index': 'E',
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

    $scope.uploadImage = function(file) {
      var promise = deferredService.getPromise(queastionBankService.uploadImage(token, file, $scope.currentTeacher.nip));
      promise.then(function(response) {
        $scope.showModal = false;
        $scope.image = null;
        $scope.file = null;
      }, function(errorResponse) {
        errorHandle.setError(errorResponse);
      }).then(function() {
        findAllGallery();
      });
    };

    function findAllGallery() {
      var promise = deferredService.getPromise(queastionBankService.findAllGallery(token, $scope.currentTeacher.nip));
      promise.then(function(response) {
        $scope.imageGalery = [];
        angular.forEach(response.data, function(data) {
          var pathFile = data.pathFile.split('webapps')[1];
          if (pathFile.indexOf("\\") != (-1)) {
            pathFile = pathFile.split("\\").join("/");
          }
          //var basePath = baseUrl.getUrl().split('/cbt-backend')[0];
          pathFile = ".." + pathFile;
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
      $scope.qPassageType = "";
      if (!$scope.isUpdatePassageQ) {
        $scope.passageQuestions.push(passageQuestion);
      } else {
        $scope.passageQuestions[$scope.editIndexQuestion] = passageQuestion;
        $scope.isUpdatePassageQ = false;
      }
      $scope.selectedQuestion = initQst();
      $scope.qstOptions = [];
      $scope.showAddQst = false;
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
      var promise = deferredService.getPromise(subjectService.fetchAllChapter($scope.currentTeacher.id, token));
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
      findAll().then(function() {
        var promise = deferredService.getPromise(queastionBankService.detailQuestionGroup($stateParams.qId, token));
        promise.then(
          function(response) {
            $scope.questionGroup = response.data.questionGroup[0];
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
          },
          function(errorResponse) {
            errorHandle.setError(errorResponse);
          });
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

    $scope.saveQuestion = function() {
      if (type === "MC" || type === "TF") {
        if ($scope.questionUpdate) {
          $scope.questionGroup.questions[0] = $scope.selectedQuestion;
        } else {
          $scope.questionGroup.questions.push($scope.selectedQuestion);
        }
      } else if (type === "PASSAGE") {
        $scope.questionGroup.questions = $scope.passageQuestions;
      }

      if ($scope.questionUpdate) {
        var promise = deferredService.getPromise(queastionBankService.updateQuestionGroup(token, $scope.questionGroup));
        promise.then(function(response) {
          $state.go("^");
        }, function(errorResponse) {
          errorHandle.setError(errorResponse);
        });
      } else {
        var promise = deferredService.getPromise(queastionBankService.createQuestionGroup(token, $scope.questionGroup));
        promise.then(function(response) {
          $state.go("^");
        }, function(errorResponse) {
          errorHandle.setError(errorResponse);
        });
      }
    };

    if ($stateParams.qId != null && $stateParams.qId != "") {
      findQuestionGroupDetail();
      $scope.questionUpdate = true;
    } else {
      findAll();
    }

    findAllGallery();
  });
