'use strict';

describe('Controller: TreesCtrl', function() {
  //$httpBackend, $rootScope, $controller, scope, API_ROOT, TreesCtrl, Trees;

  //var $httpBackend, scope;

  beforeEach(module('ngl2'));

  beforeEach(inject(function($controller, $httpBackend, $rootScope, $routeParams, $location, Trees, Auth) {
    this.$httpBackend = $httpBackend;
    this.scope = $rootScope.$new();

    $controller('TreesCtrl', {
      $scope: this.scope,
      $routeParams: $routeParams,
      $location: $location,
      Trees: Trees,
      Auth: Auth
    });
  }));

  afterEach(function() {
    this.$httpBackend.verifyNoOutstandingExpectation();
    this.$httpBackend.verifyNoOutstandingRequest();
  });

  it('should exist', function() {
    expect(this.scope.create).toNotBe(null);
  });

  it('should fetch list of trees', function(){
    this.$httpBackend.when('GET', 'http://localhost:3000/api/v1/trees?auth_token=')
      .respond(200, {'trees': [{'name': 'Sample Tree'},{'name': 'Another Tree'}]});

    this.scope.find();
    this.$httpBackend.flush();

    expect(this.scope.trees.length).toBe(2);
    expect(this.scope.trees[0].name).toBe('Sample Tree');
  });
});