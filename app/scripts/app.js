'use strict';

window.app = angular.module('ngl2', ['ngResource','ngCookies','ngl2.controllers','ngl2.services'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/login', {
        templateUrl: 'views/auth/login.html'
      })
      .when('/trees', {
        templateUrl: 'views/trees/list.html',
        controller: 'TreesCtrl'
      })
      .when('/trees/:treeId', {
        templateUrl: 'views/trees/view.html'
      })
      .when('/trees/:treeId/people/create', {
        templateUrl: 'views/people/create.html'
      })
      .when('/trees/:treeId/people/:personId/create', {
        templateUrl: 'views/people/create.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .config(['$httpProvider', function($httpProvider) {
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  }]);

angular.module('ngl2.controllers', ['ngl2.controllers.main', 'ngl2.controllers.auth', 'ngl2.controllers.trees', 'ngl2.controllers.people']);
angular.module('ngl2.services', ['ngl2.services.global', 'ngl2.services.auth', 'ngl2.services.trees', 'ngl2.services.people']);
