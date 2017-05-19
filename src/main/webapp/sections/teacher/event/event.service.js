(function() {
    'use strict';
    angular.module('app')
        .factory('eventService', eventService);

    eventService.$inject = ['$http', 'baseUrl'];

    function eventService($http, baseUrl) {
        var url = baseUrl.getUrl();
        return {
            saveEvent: function(selectedEvent, token) {
                var params = [{
                    'authorization': token,
                    'event': selectedEvent
                }];
                return $http.post(url + '/teacher/teacher_event_mgmt/create/', params);
            },

            updateEvent: function(selectedEvent, token) {
                var params = [{
                    'authorization': token,
                    'event': selectedEvent
                }];
                return $http.put(url + '/teacher/teacher_event_mgmt/update/', params);
            },

            fetchAllEvent: function(token, nip) {
                return $http.get(url + '/teacher/teacher_event_mgmt/' + token + '/' + nip);
            },
            findEvent: function(eventId, token) {
                return $http.get(url + '/teacher/teacher_event_mgmt/detail/' + token + '/' + eventId);
            },
            fetchEventResult: function(eventId, classId, token) {
                return $http.get(url + '/teacher/teacher_event_mgmt/list_event_result/' + token + '/' + eventId + '/' + classId);
            }
        };
    }
})();