angular.module('app.messages')
    .factory('DialogFactory', ['$uibModal', "$uibModal", "$http", function($uibModal, $http, $timeout) {
        return {
            showDialogMsg: function(title, content, size) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'components/modal-template/dialog.msg.html',
                    controller: 'DialogMessageCtrl',
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
                    templateUrl: 'components/modal-template/confirmation.msg.html',
                    controller: 'DialogMessageCtrl',
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

            openCredit: function() {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'components/knt-credit.html',
                    controller: function() {

                    },
                    size: 'md'
                });
            },

            openImagesGallery: function(images, token) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'components/modal-template/images-gallery.html',
                    controller: function($scope, $uibModalInstance, queastionBankService, images, token) {
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
                    },
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
                    templateUrl: 'components/modal-template/help.msg.html',
                    controller: function($scope, helpType) {
                        $scope.helpType = helpType;
                    },
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
                    templateUrl: 'components/modal-template/dialog.msg.html',
                    controller: function($scope, $uibModalInstance, titleText, contentText, $sce, $timeout) {

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
                    },
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
                    templateUrl: 'components/modal-template/export-xlsx-preview.html',
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
                    controller: function($scope, eventResultData, $uibModalInstance, eventName) {
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
                });
            }

        };
    }]);