angular.module('app.messages')
    .factory('DialogFactory', ['$uibModal', function($uibModal, $http) {
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
            }

        };
    }]);