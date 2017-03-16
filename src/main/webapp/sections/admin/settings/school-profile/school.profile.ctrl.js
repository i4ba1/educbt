angular.module('app.core')
    .controller('SchoolProfileController', function($scope, schoolProfileService, $state, $http, storageService, baseUrl, errorHandle) {

        /*
         * checking authorization
         */
        var token = " ";
        if (!storageService.isAuthorization("ADMIN")) {
            $state.go("checkroute");
        } else {
            token = storageService.getToken();
        }


        $scope.profile = {
            id: "",
            schoolName: "",
            schoolDescription: "",
            file: null
        };

        $scope.tinyMce = {};
        var varMenu = {
            file: {
                title: 'File',
                items: 'newdocument'
            },
            edit: {
                title: 'Edit',
                items: 'undo redo | cut copy paste | selectall'
            },
            insert: {
                title: 'Insert',
                items: 'charmap'
            },
            format: {
                title: 'Format',
                items: 'bold italic underline strikethrough superscript subscript | formats | removeformat'
            },
            table: {
                title: 'Table',
                items: 'inserttable tableprops deletetable | cell row column'
            },
            tools: {
                title: 'Tools',
                items: 'spellchecker code'
            }
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

        $scope.tinyMceConfig = {
            selector: 'textarea',
            height: 250,
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

        $scope.file = null;
        $scope.isUpdate = false;
        $scope.image = "";

        /*
         * there is any bugs when update image...
         */

        function fetchScoolProfile() {
            var promise = schoolProfileService.fetchProfile(token);
            promise.then(
                function(response) {
                    $scope.isUpdate = true;
                    $scope.profile.id = response.data.id;
                    $scope.profile.schoolName = response.data.schoolName;
                    $scope.profile.schoolDescription = response.data.schoolDescription;
                    $scope.image = 'data:' + response.data.contentType + ';base64,' + response.data.fileData;
                    var blob = response.data.fileData;
                    $scope.file = new File([blob], response.data.fileName, {
                        type: response.data.contentType
                    });
                    console.log("Image" + $scope.file);
                },
                function(error) {
                    if (error.status == 404) {
                        $scope.isUpdate = false;
                        $scope.image = 'assets/images/profile.png'
                    } else {
                        errorHandle.setError(error);
                    }
                }
            );
            return promise;
        };

        $scope.submit = function() {
            $scope.profile.file = $scope.file;
            var promise = schoolProfileService.saveOrUpdateProfile($scope.profile, $scope.isUpdate, token);
            promise.then(function() {
                $state.go("^")
            });
        };

        fetchScoolProfile();
    });