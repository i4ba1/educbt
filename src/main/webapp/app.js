(function() {

    'use strict';

    angular
        .module('app', [
            'ui.router',
            'app.core',
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

    run.$inject = ['bsLoadingOverlayService', 'DialogFactory', '$rootScope'];
    config.$inject = ['usSpinnerConfigProvider', 'localStorageServiceProvider'];

    // ===========[function]======================================================

    function run(bsLoadingOverlayService, DialogFactory, $rootScope) {
        bsLoadingOverlayService.setGlobalConfig({
            templateUrl: 'components/overlay.html'
        });

        $rootScope.openHelp = DialogFactory.openHelpMsg;
    }

    function config(usSpinnerConfigProvider, localStorageServiceProvider) {
        usSpinnerConfigProvider.setTheme('default', {
            color: 'black',
            radius: 20,
            width: 10,
            length: 20
        });

        localStorageServiceProvider
            .setPrefix('eduCbtApp')
            .setStorageType('localStorage')
            .setNotify(true, true)
            .setStorageCookie(1, '<path>', false);
    }

})();