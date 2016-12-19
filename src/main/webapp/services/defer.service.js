angular.module('app.core')
    .factory('deferredService', ['$q', '$timeout', '$log', function($q, $timeout, $log) {
        return {
            getPromise: function(service) {
                var deferred = $q.defer();
                if (service.success !== undefined) {
                    service.success(function(data, status, headers, config) {
                            var results = [];
                            results.data = data;
                            results.headers = headers();
                            results.status = status;
                            results.config = config;
                            deferred.resolve(results);
                        })
                        .error(function(data, status) {
                            var errorResponse = [];
                            errorResponse.data = data;
                            errorResponse.status = status;
                            deferred.reject(errorResponse);
                        });

                }
                return deferred.promise;
            }
        };
    }]);