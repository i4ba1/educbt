(function() {

    'use strict';

    angular
        .module('app')
        .controller('ChapterController', ChapterController);

    ChapterController.$inject = ['$scope', '$stateParams', '$state', 'subjectService', 'storageService', 'errorHandle', '$timeout', 'DialogFactory'];

    function ChapterController($scope, $stateParams, $state, subjectService, storageService, errorHandle, $timeout, DialogFactory) {

        /*
         * checking authorization
         */

        var token = " ";
        $scope.currentTeacher = null;
        if (!storageService.isAuthorization("EMPLOYEE")) {
            $state.go("checkroute");
        } else {
            token = storageService.getToken();
            $scope.currentTeacher = storageService.getLoggedInUser();
            console.log($scope.currentTeacher);
        }

        $scope.chapters = [];
        $scope.isUpdate = false;
        $scope.subjects = [];
        $scope.selectedChapter = {
            'id': null,
            'subject': null,
            'tagName': null,
            'deleted': false,
            'teacher': $scope.currentTeacher
        };

        $scope.showModal = false;
        $scope._index = 0;

        $scope.toggleModal = function(index, chapterModel) {
            $scope._index = index;
            $scope.selectedChapter = chapterModel;
            DialogFactory.confDialogMsg('Konfirmasi Hapus Data', 'Apakah anda yakin untuk menghapus sub materi?', 'md')
                .then(function(response) {
                    if (response) {
                        $scope.delete();
                    }
                }, function(dismiss) {});
        };

        /*
         *This Function used to fetch all teacher data
         */
        function findAllSubejct() {
            var promise = subjectService.fetchAllSubject(token);
            promise.then(
                function(response) {
                    $scope.subjects = response.data;
                },
                function(errorResponse) {
                    errorHandle.setError(errorResponse);
                });
        };

        /*
         *This Function used to fetch all teacher data
         */
        function findAll() {
            var promise = subjectService.fetchAllChapter($scope.currentTeacher.id, token);
            promise.then(
                function(response) {
                    $scope.chapters = response.data;
                },
                function(errorResponse) {
                    errorHandle.setError(errorResponse);
                });
        };

        /*
         * fin subject by subject id to editing selected subject
         */
        function findChapterById(id) {
            var promise = subjectService.findChapter(id, token);
            promise.then(
                function(response) {
                    $scope.selectedChapter = response.data;
                    console.log("Entering here");
                },
                function(errorResponse) {
                    errorHandle.setError(errorResponse);
                }
            );
        };

        /*
         *This Function used save or update
         *SAVING when $scope.isUpdate equal false
         *and UPDATING when $scope.isUpdate equal true
         */
        $scope.saveOrUpdate = function() {
            if (!$scope.isUpdate) {
                $scope.selectedChapter.subject = JSON.parse($scope.selectedChapter.subject);
            }
            var params = [{
                'authorization': token,
                'tag': {
                    'tagId': $scope.selectedChapter.id,
                    'tagName': $scope.selectedChapter.tagName,
                    'subjectId': $scope.selectedChapter.subject.id,
                    'teacherId': $scope.selectedChapter.teacher.id
                },
            }];

            var promise;
            if ($scope.isUpdate) {
                promise = subjectService.updateChapter(params);
                promise.then(
                    function(response) {
                        $state.go('teacher.chapter');
                    },
                    function(errorResponse) {
                        errorHandle.setError(errorResponse);
                    });
            } else {
                promise = subjectService.createChapter(params);
                promise.then(
                    function(response) {
                        $state.go('teacher.chapter');
                    },
                    function(errorResponse) {
                        if (errorResponse.status == 404) {
                            DialogFactory.showDialogMsg("Simpan Data Gagal", "Matapelajaran sudah pernah dibuat", "md");
                        } else {
                            errorHandle.setError(errorResponse);
                        }
                    });
            }
        };

        /*
         * used for deleting selected chapter by chapter id
         */
        $scope.delete = function() {
            $scope.chapters.splice($scope._index, 1);
            var promise = subjectService.deleteChapter($scope.selectedChapter.id, token);
            promise.then(
                function(response) {
                    $scope.showModal = false;
                },
                function(errorResponse) {
                    errorHandle.setError(errorResponse);
                });
        };

        $scope.update = function(id) {
            if (id != null) {
                $state.go('teacher.chapter.createOrUpdate', {
                    'chapterId': id
                });
            }
        }


        findAllSubejct();

        if ($state.is('teacher.chapter')) {
            findAll();
        } else if ($state.is('teacher.chapter.createOrUpdate')) {
            if ($stateParams.chapterId != undefined && $stateParams.chapterId != null && $stateParams.chapterId != "") {
                findChapterById($stateParams.chapterId);
                $scope.isUpdate = true;
            } else {
                $scope.isUpdate = false;
            }
        }
    }

})();