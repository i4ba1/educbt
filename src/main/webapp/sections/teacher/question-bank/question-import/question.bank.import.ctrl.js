'use strict';
angular.module('app.core')
    .controller('QuestionBankImportController', function($scope) {
        $(document).ready(function() {
            $(":file").filestyle({ input: false, buttonName: 'btn-default', buttonText: 'Pilih Berkas XLS' });
        });
    });