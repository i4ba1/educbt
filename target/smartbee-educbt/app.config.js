'use strict';
angular
    .module('app.config', [])
    .config(configs);

function configs(localStorageServiceProvider) {

    localStorageServiceProvider
        .setPrefix('eduCbtApp')
        .setStorageType('localStorage')
        .setNotify(true, true)
        .setStorageCookie(1, '<path>', false);
}