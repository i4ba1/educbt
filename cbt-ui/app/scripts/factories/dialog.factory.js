(function() {

    'use strict';
    angular.module('app').factory('DialogFactory', dialogFactory);

    dialogFactory.$inject = ["$uibModal", "$http", "$timeout"];

    function dialogFactory($uibModal, $http, $timeout) {
        return {
            showDialogMsg: function(title, content, size) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'views/components/modal-template/dialog.html',
                    controller: dialogMessageController,
                    size: size,
                    backdrop: 'static',
                    resolve: {
                        titleText: function() {
                            return title;
                        },
                        contentText: function() {
                            return content;
                        }
                    }
                });

                return modalInstance.result;
            },

            confDialogMsg: function(title, content, size) {

                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'views/components/modal-template/confirmation.html',
                    controller: dialogMessageController,
                    size: size,
                    backdrop: 'static',
                    resolve: {
                        titleText: function() {
                            return title;
                        },
                        contentText: function() {
                            return content;
                        }
                    }
                });


                return modalInstance.result;
            },

            showErrorMsg: function(title, messages) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'views/components/modal-template/error.html',
                    controller: errorMessageController,
                    size: 'md',
                    backdrop: 'static',
                    resolve: {
                        modalData: function() {
                            return {
                                title: title,
                                messages: messages,
                                content: ''
                            };
                        }
                    }
                });

                return modalInstance.result;
            },

            openCredit: function() {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'views/components/knt-credit.html',
                    size: 'md'
                });
            },

            openImagesGallery: function(images, token) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'views/components/modal-template/images-gallery.html',
                    controller: imagesGalleryController,
                    size: 'lg',
                    backdrop: 'static',
                    resolve: {
                        images: function() {
                            return images;
                        },
                        token: function() {
                            return token;
                        },
                        http: function() {
                            return $http;
                        }
                    }
                });


                return modalInstance.result;
            },

            openHelpMsg: function(helpType) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'views/components/modal-template/help.html',
                    controller: helpMessageController,
                    size: 'md',
                    resolve: {
                        helpType: function() {
                            return helpType;
                        }
                    }
                });
            },

            showReminderMsg: function(title, content, size) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'views/components/modal-template/dialog.html',
                    controller: reminderMessageController,
                    size: size,
                    resolve: {
                        titleText: function() {
                            return title;
                        },
                        contentText: function() {
                            return content;
                        }
                    }
                });

                modalInstance.result.then(function(result) {
                    $timeout.cancel(result);
                }, function(dismiss) {});
            },

            exportDataToXlsx: function(eventResultData, eventName) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'views/components/modal-template/export-xlsx-preview.html',
                    size: 'lg',
                    backdrop: 'static',
                    resolve: {
                        eventResultData: function() {
                            return eventResultData;
                        },
                        eventName: function() {
                            return eventName;
                        }
                    },
                    controller: exportDataToXlsxController
                });
            },
            licenseActivation: function() {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'views/components/modal-template/activation.html',
                    size: 'sm',
                    backdrop: 'static',
                    controller: licenseActivationController
                });

                return modalInstance.result;
            },

            showQuestionTypeOption: function(path) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: "views/components/modal-template/question-type.html",
                    size: 'sm',
                    controller: questionTypeOptionController,
                    resolve: {
                        path: function() {
                            return path;
                        }
                    }
                });

                return modalInstance.result;
            }


        };
    }

    // =============================[DIALOG CONTROLLER]==================================

    function dialogMessageController($scope, $uibModalInstance, titleText, contentText, $sce) {

        $scope.titleText = titleText;
        $scope.contentText = contentText;
        $scope.trustAsHtml = $sce.trustAsHtml;

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.close = function(value) {
            $uibModalInstance.close(value);
        }
    }

    function licenseActivationController($scope, $uibModalInstance) {
        $scope.type = "";

        $scope.close = function() {
            $uibModalInstance.close($scope.type);
        }
    }

    function exportDataToXlsxController($scope, eventResultData, $uibModalInstance, eventName) {
        $scope.eventResultData = eventResultData;
        $scope.eventName = eventName;

        $scope.close = function() {
            $uibModalInstance.close("Close");
        }

        $scope.exportToExcel = function() {
            var className = ($scope.eventResultData[0])["KELAS"];
            alasql('SELECT * INTO XLSX("' + $scope.eventName + "_" + className + '.xlsx",{headers:true}) FROM ?', [$scope.eventResultData]);

            $scope.close();
        }
    }

    function reminderMessageController($scope, $uibModalInstance, titleText, contentText, $sce, $timeout) {

        $scope.titleText = titleText;
        $scope.contentText = contentText;
        $scope.trustAsHtml = $sce.trustAsHtml;
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.close = function(value) {
            $uibModalInstance.close(value);
        }

        var timeout = $timeout(function() {
            $scope.close(timeout);
        }, 10000);
    }

    function helpMessageController($scope, helpType) {
        $scope.helpType = helpType;
    }

    function imagesGalleryController($scope, $uibModalInstance, queastionBankService, images, token) {
        $scope.view = 'list';
        $scope.images = images;
        $scope.file;
        var token = token;

        $scope.close = function(value) {
            $uibModalInstance.dismiss({
                images: $scope.images
            });
        };
        $scope.addImage = function(value) {
            $scope.view = value;
        };
        $scope.saveImage = function(file) {
            $scope.images.push({
                imageName: file.filename,
                base64: 'data:' + file.filetype + ';base64,' + file.base64
            });
            $scope.addImage('list');
        };

        $scope.doubleClick = function(file) {
            $uibModalInstance.close({
                images: $scope.images,
                selectedImage: file
            });
        };

        $scope.deleteImage = function(index) {
            var imageId = $scope.images[index].id;
            if (imageId) {
                queastionBankService.deleteImage(token, imageId);
            }
            $scope.images.splice(index, 1);
        }
    }

    function errorMessageController($scope, $uibModalInstance, modalData) {

        $scope.modalData = modalData;

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
            var elements = document.getElementsByClassName('modal-backdrop');
            while (elements.length > 0) {
                elements[0].parentNode.removeChild(elements[0]);
            }
        };
    }

    function eventQuestionOptions($scope, $uibModalInstance) {

    }

    function questionTypeOptionController($scope, $uibModalInstance, path) {
        $scope.questionType = null;
        $scope.path = path === "questionBankDetail";

        $scope.close = function(questionType) {
            $uibModalInstance.close(questionType);
        }
    }

})();