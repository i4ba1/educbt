(function () {

    'use strict';

    angular
        .module('app', [
            'ui.router',
            'ngTable',
            'ngSanitize',
            'ngCsvImport',
            'ngThread',
            'ngMessages',
            'ngResource',
            'timer',
            'ui.bootstrap',
            // 'angularjs-datetime-picker',
            'checklist-model',
            'LocalStorageModule',
            'angularSpinner',
            'ui.select',
            'ui.tinymce',
            'naif.base64',
            "bsLoadingOverlay"

        ])
        .config(config)
        .run(run);

    run.$inject = ['bsLoadingOverlayService', 'DialogFactory', '$rootScope', '$interval','$http'];
    config.$inject = ['usSpinnerConfigProvider', 'localStorageServiceProvider', '$qProvider'];

    // ===========[function]======================================================

    function run(bsLoadingOverlayService, DialogFactory, $rootScope, $interval, $http) {
        bsLoadingOverlayService.setGlobalConfig({
            templateUrl: 'views/components/overlay.html'
        });

        $rootScope.openHelp = DialogFactory.openHelpMsg;
        $rootScope.$watch(function () {
            MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
            return true;
        });

        $rootScope.serverTime = new Date();
        $rootScope.updateServerTime = function () {
            $http.post("/smartbee-educbt/user/authorization/getServerTime/").then(
                function (response) {
                    $rootScope.serverTime = new Date(response.data.serverTime);
                    var tick = function () {
                        $rootScope.serverTime.setSeconds($rootScope.serverTime.getSeconds() + 1);
                    }
                    tick();
                    $interval(tick, 1000);
                },
                function (err) {
                    console.log(err);
                }
            );
        }

        $rootScope.updateServerTime();

    }



    function config(usSpinnerConfigProvider, localStorageServiceProvider) {
        usSpinnerConfigProvider.setTheme('default', {
            color: 'blue',
            radius: 20,
            width: 10,
            length: 20
        });

        localStorageServiceProvider
            .setPrefix('eduCbtApp')
            .setStorageType('localStorage')
            .setNotify(true, true)
            .setStorageCookie(1, '<path>', false);

        // qProvider.errorOnUnhandledRejections(false);
    }

})();