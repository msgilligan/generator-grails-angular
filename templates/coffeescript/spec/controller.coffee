'use strict'

describe 'Controller: <%= _.classify(injectableName) %>Ctrl', () ->

  # load the controller's module
  beforeEach module '<%= _.camelize(appname) %>App'

  <%= _.classify(name) %>Ctrl = {}
  scope = {}

  # Initialize the controller and a mock scope
  beforeEach inject ($controller) ->
    scope = {}
    <%= _.classify(name) %>Ctrl = $controller '<%= _.classify(injectableName) %>Ctrl', {
      $scope: scope
    }

  it 'should attach a list of awesomeThings to the scope', () ->
    expect(scope.awesomeThings.length).toBe 3;
