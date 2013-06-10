'use strict';

angular.module('<%= _.camelize(appname) %>App')
  .controller('<%= _.classify(injectableName) %>Ctrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
