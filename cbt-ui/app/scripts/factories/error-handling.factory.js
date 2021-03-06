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