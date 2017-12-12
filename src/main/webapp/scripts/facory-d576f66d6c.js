(function() {

    'use strict';
    angular.module('app').factory('baseUrl', baseUrl);

    baseUrl.$inject = ['$http'];

    function baseUrl($http) {
        return {
            getUrl: function() {
                return "/smartbee-educbt";
            },
            getRemote: function() {
                return "http://192.168.5.188:8080/helpdesk"
            }
        };
    }

})();
(function() {

    'use strict';
    angular.module('app').factory('storageService', storageService);

    storageService.$inject = ['$http', 'baseUrl', '$state', 'localStorageService', '$rootScope'];

    function storageService($http, baseUrl, $state, localStorageService, $rootScope) {
        var url = baseUrl.getUrl();
        var dataFactory = {};
        var loggedIn;

        dataFactory.isAuthorization = function(role) {
            var result = false;
            var token = localStorageService.get("TOKEN");
            loggedIn = localStorageService.get("USER");
            $rootScope.type = localStorageService.get("APP-TYPE");
            if (loggedIn != undefined && (loggedIn.userType.toLowerCase() == role.toLowerCase())) {
                if (token != undefined) {
                    result = true;
                } else {
                    result = false;
                }
            }
            return result;
        };

        dataFactory.getLoggedInUser = function() {
            loggedIn = localStorageService.get("USER");
            return loggedIn;
        };

        dataFactory.loggedOut = function() {
            var url = baseUrl.getUrl();
            var tokens = [{
                'token': localStorageService.get("TOKEN")
            }];

            $http.post(url + '/user/authorization/loggedOut/', tokens);
            localStorageService.remove("USER");
            localStorageService.remove("TOKEN");
            $state.go("login")
        };

        dataFactory.getToken = function(service) {
            return localStorageService.get("TOKEN");
        };

        dataFactory.isUserExistThenRedirectTo = function() {
            var user = localStorageService.get("USER");
            if (user) {
                switch (user.userType.toLowerCase()) {
                    case "student":
                        $state.go("student");
                        break;
                    case "employee":
                        $state.go("teacher");
                        break;
                    case "admin":
                        $state.go("admin");
                        break;
                }
            } else {
                $state.go("login");
            }
        };

        return dataFactory;

    }

})();
(function() {

    'use strict';
    angular.module('app').factory('errorHandle', errorHandle);

    errorHandle.$inject = ['storageService', 'DialogFactory'];

    function errorHandle(storageService, DialogFactory) {
        var handle = [];
        handle.setError = function(errorRespon) {
            if (errorRespon.status == 401) {
                var result = DialogFactory.showDialogMsg('Sesi Anda Telah Habis', 'Maaf sesi anda telah habis, silahkan melakukan login ulang !');
                result.then(function(respon) {}, function(dismiss) {
                    storageService.loggedOut()
                });

            } else if (errorRespon.status == 500) {
                console.log("ERROR : " + errorRespon.data);
            }
        };
        return handle;
    }
})();
(function() {

    'use strict';
    angular.module('app').factory('tinyMce', tinyMce);

    tinyMce.$inject = ['$sce'];

    function tinyMce($sce) {
        var tinyMce = {};
        var varMenu = {
            file: { title: 'File', items: 'newdocument' },
            edit: { title: 'Edit', items: 'undo redo | cut copy paste | selectall' },
            insert: { title: 'Insert', items: 'charmap' },
            format: {
                title: 'Format',
                items: 'bold italic underline strikethrough superscript subscript | formats | removeformat'
            },
            table: {
                title: 'Table',
                items: 'inserttable tableprops deletetable | cell row column'
            },
            tools: { title: 'Tools', items: 'spellchecker code' }
        };

        var themeAdvancedFonts =
            "Andale Mono=andale mono,times;" +
            "Arial=arial,helvetica,sans-serif;" +
            "Arial Black=arial black,avant garde;" +
            "Book Antiqua=book antiqua,palatino;" +
            "Comic Sans MS=comic sans ms,sans-serif;" +
            "Courier New=courier new,courier;" +
            "Georgia=georgia,palatino;" +
            "Helvetica=helvetica;" +
            "Impact=impact,chicago;" +
            "Symbol=symbol;" +
            "Tahoma=tahoma,arial,helvetica,sans-serif;" +
            "Terminal=terminal,monaco;" +
            "Times New Roman=times new roman,times;" +
            "Trebuchet MS=trebuchet ms,geneva;" +
            "Verdana=verdana,geneva;" +
            "Webdings=webdings;" +
            "Wingdings=wingdings,zapf dingbats";

        var themeFontSize = '8pt 10pt 12pt 14pt 18pt 24pt 36pt';
        var plugins = [
            'advlist autolink lists link image charmap print preview hr anchor pagebreak',
            'searchreplace wordcount visualblocks visualchars code fullscreen',
            'insertdatetime media nonbreaking save table contextmenu directionality',
            'emoticons template paste textcolor colorpicker textpattern imagetools'
        ];
        // var menubar = 'file edit insert format table';
        var menubar = '';
        var toolbar = 'undo redo |  bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent ';
        var toolbar2 = 'fontselect fontsizeselect | forecolor backcolor | table charmap link';

        tinyMce.config = function(height) {
            return {
                selector: 'textarea',
                height: height,
                menu: varMenu,
                menubar: menubar,
                plugins: plugins,
                toolbar1: toolbar,
                toolbar2: toolbar2,
                image_advtab: true,
                font_formats: themeAdvancedFonts,
                fontsize_formats: themeFontSize,
                resize: false
            };
        };

        tinyMce.trustAsHtml = function(string) {
            return $sce.trustAsHtml(string);
        };

        return tinyMce;
    }


})();
(function() {

    'use strict';
    angular.module('app').factory('labelFactory', labelFactory);

    function labelFactory() {
        var label = {};
        var labels = [
            { 'name': 'label label-default' },
            { 'name': 'label label-primary' },
            { 'name': 'label label-success' },
            { 'name': 'label label-info' },
            { 'name': 'label label-warning' },
            { 'name': 'label label-danger' }
        ];

        label.getLabelType = function(value, value_2) {
            var index = value_2 % 6;
            var result = "<label class='" + labels[index].name + "'>" + value + "</label>";
            return result;
        };

        label.labels = function() {
            return labels;
        };

        label.difficultyConverter = function(str) {
            if (str === 'EASY') {
                return 'Mudah';
            } else if (str === 'MEDIUM') {
                return 'Sedang';
            } else if (str === 'HARD') {
                return 'Sulit';
            }

        };
        return label;
    }

})();
(function() {

    'use strict';
    dialogMessageController.$inject = ["$scope", "$uibModalInstance", "titleText", "contentText", "$sce"];
    errorMessageController.$inject = ["$scope", "$uibModalInstance", "modalData", "$sce"];
    imagesGalleryController.$inject = ["$scope", "$uibModalInstance", "queastionBankService", "images", "token"];
    helpMessageController.$inject = ["$scope", "helpType"];
    reminderMessageController.$inject = ["$scope", "$uibModalInstance", "titleText", "contentText", "$sce", "$timeout"];
    exportDataToXlsxController.$inject = ["$scope", "eventResultData", "$uibModalInstance", "eventName"];
    licenseActivationController.$inject = ["$scope", "$uibModalInstance"];
    questionTypeOptionController.$inject = ["$scope", "$uibModalInstance", "path"];
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

    function errorMessageController($scope, $uibModalInstance, modalData, $sce) {

        $scope.modalData = modalData;
        $scope.trustAsHtml = $sce.trustAsHtml;

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
            var elements = document.getElementsByClassName('modal-backdrop');
            while (elements.length > 0) {
                elements[0].parentNode.removeChild(elements[0]);
            }
        };

        $scope.gotoManual = function() {
            $uibModalInstance.close('gotomanual');
        }
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
(function() {

    'use strict';
    angular.module('app').factory('SortFactory', sortFactory);

    function sortFactory() {
        return {
            sortArr: function(arrayObj, sortBy, orderBy) {
                arrayObj.sort(function(objA, objB) {
                    var conditionA = objA[sortBy].toString().toUpperCase();
                    var conditionB = objB[sortBy].toString().toUpperCase();
                    if (orderBy === 'desc')
                        return (conditionA > conditionB) ? -1 : (conditionA < conditionB) ? 1 : 0;
                    else
                        return (conditionA < conditionB) ? -1 : (conditionA > conditionB) ? 1 : 0;
                });
                return arrayObj;
            }
        };
    }

})();