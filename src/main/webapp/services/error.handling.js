angular.module('app.core')
    .factory('errorHandle', ['$log', 'storageService', function($log, storageService) {
        var handle = [];
        handle.setError = function(errorRespon) {
            if (errorRespon.status == 401) {
                // storageService.loggedOut();
            } else if (errorRespon.status == 500) {
                $log.error("ERROR : " + errorRespon.data);
            }
        };
        return handle;
    }]);