(function() {
    'use strict';
    angular.module('app').directive('serverTimeWhite', serverTimeWhite);
    angular.module('app').directive('serverTimeBlack', serverTimeBlack);

    function serverTimeWhite() {
        return {
            restrict: 'E',
            template: '<div class="server-time-white">{{serverTime|date:"dd/MM/yyyy HH:mm:ss"}}</div>'
        }
    }

    function serverTimeBlack() {
        return {
            restrict: 'E',
            template: '<div class="server-time-black">{{serverTime|date:"dd/MM/yyyy HH:mm:ss"}}</div>'
        }
    }

})();


