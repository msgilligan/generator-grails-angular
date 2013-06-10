'use strict'

angular.module('<%= _.camelize(appname) %>App')
  .controller '<%= _.classify(injectableName) %>Ctrl', ['$scope', ($scope) ->
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ]
  ]
