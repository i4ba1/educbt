angular.module('app.core')
  .factory('importService', ['$http', '$q', function ($http, $q) {
    readData: function(allText) {

      // split content based on new line
      var allTextLines = allText.split(/\r\n|\n/);
      var headers = allTextLines[0].split(',');
      var lines = [];

      for (var i = 0; i < allTextLines.length; i++) {
        // split content based on comma
        var data = allTextLines[i].split(',');

        if (data.length == headers.length) {
          var tarr = [];
          for (var j = 0; j < headers.length; j++) {
            tarr.push(data[j]);
          }

          lines.push(tarr);
        }
      }

      return lines;
    }
  }]);
