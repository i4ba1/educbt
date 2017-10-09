(function() {

    'use strict';
    angular.module('app').factory('SortFactory', sortFactory);

    function sortFactory() {
        return {
            sortArr: function(arrayObj, sortBy, orderBy) {
                arrayObj.sort(function(objA, objB) {
                    var conditionA = objA[sortBy].toString().toUpperCase();
                    var conditionB = objB[sortBy].toString().toUpperCase();
                    if (orderBy === 'desc')
                        return (conditionA > conditionB) ? -1 : (conditionA < conditionB) ? 1 : 0;
                    else
                        return (conditionA < conditionB) ? -1 : (conditionA > conditionB) ? 1 : 0;
                });
                return arrayObj;
            }
        };
    }

})();