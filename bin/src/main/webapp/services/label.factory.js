angular.module('app.core')
  .factory('labelFactory', [function() {
    var label = {};
    var labels = [{
      'name': 'label label-default'
    }, {
      'name': 'label label-primary'
    }, {
      'name': 'label label-success'
    }, {
      'name': 'label label-info'
    }, {
      'name': 'label label-warning'
    }, {
      'name': 'label label-danger'
    }];

    label.getLabelType = function(value, value_2) {
      var index = value_2 % 6;
      var result = "<label class='" + labels[index].name + "'>" + value + "</label>";
      return result;
    };

    label.labels = function() {
      return labels;
    };

    label.difficultyConverter = function(str){
      if(str ==='EASY'){
        return 'Mudah';
      }else if(str ==='MEDIUM'){
        return 'Sedang';
      }if(str ==='HARD'){
        return 'Sulit';
      }

    };
    return label;
  }]);
