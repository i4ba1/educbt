angular
  .module('app.core')
  .directive('windowExit', function($window, loginService, localStorageService, $state) {
    return {
      restrict: 'AE',
      compile: function(element, attrs) {

        $window.onbeforeunload = function() {
          var isLogin = $state.is('login');
          if (localStorageService.length() > 1) {
            var token = localStorageService.get("TOKEN");
            var params = [];
            var param = {
              'authorization': token,
              'deleted': true
            };
            params.push(param);
            var promise = loginService.closeHandle(params);
          }
        }

        $window.onload = function() {
          var isLogin = $state.is('login');
          if (localStorageService.length() > 1 && !isLogin) {
            var token = localStorageService.get("TOKEN");
            var params = [];
            var param = {
              'authorization': token,
              'deleted': false
            };
            params.push(param);
            var promise = loginService.closeHandle(params);
          }
        }

      }
    };
  });
