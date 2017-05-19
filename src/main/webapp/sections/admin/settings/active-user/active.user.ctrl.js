(function() {

    'use strict';
    angular.module('app').controller('ActiveUserController', ActiveUserController);

    ActiveUserController.$inject = ['$scope', '$filter', 'ngTableParams', '$stateParams', '$state', 'storageService', 'errorHandle', 'activeUserService']

    function ActiveUserController($scope, $filter, ngTableParams, $stateParams, $state, storageService, errorHandle, activeUserService) {

        var token = "";
        if (!storageService.isAuthorization("ADMIN")) {
            $state.go("checkroute");
        } else {
            token = storageService.getToken();
        }

        $scope.activeUser = "";
        $scope.activeUsers = [];
        $scope.showModal = false;

        $scope.toggleModal = function(activeUser) {
            $scope.activeUser = activeUser;
            $scope.showModal = !$scope.showModal;
        }

        /*
         *This Function used to fetch all teacher data
         */
        function fetchAllActiveUser() {
            $scope.activeUsers = [];
            var promise = activeUserService.fetchAllActiveUser(token);
            promise.then(
                function(response) {
                    $scope.activeUsers = response.data;
                    updateTableData($scope.activeUsers);
                },
                function(errorResponse) {
                    errorHandle.setError(errorResponse);
                }
            );
        };

        $scope.delete = function() {
            var promise = activeUserService.deleteActiveUser($scope.activeUser.id, token);
            promise.then(
                function(response) {
                    $scope.showModal = false;
                    fetchAllActiveUser();
                },
                function(errorResponse) {
                    errorHandle.setError(errorResponse);
                });
        };

        $scope.dataTable = new ngTableParams();

        /*$scope.
         * function to update ngTableParams in to show all class
         */
        function updateTableData(data_table) {
            $scope.dataTable = new ngTableParams({
                page: 1,
                count: 10
            }, {
                getData: function($defer, params) {
                    var data = params.sorting() ? $filter('orderBy')(data_table,
                        params.orderBy()) : data_table;
                    data = params.filter() ? $filter('filter')(data,
                        params.filter()) : data;
                    data = data.slice((params.page() - 1) * params.count(),
                        params.page() * params.count());
                    $defer.resolve(data);
                },
                total: data_table.length
            });
        };

        fetchAllActiveUser();
    }
})();