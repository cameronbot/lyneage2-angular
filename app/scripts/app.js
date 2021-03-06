'use strict';

window.app = angular.module('ngl2', ['ngResource','ngCookies','ngSanitize','ngl2.controllers','ngl2.services', 'ngl2.directives', 'ui.bootstrap'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/static/intro.html'
      })
      .when('/login', {
        templateUrl: 'views/auth/login.html'
      })
      .when('/trees', {
        templateUrl: 'views/trees/list.html',
        controller: 'TreesCtrl'
      })
      .when('/trees/:treeId', {
        templateUrl: 'views/trees/interface.html'
      })
      .when('/trees/:treeId/people/create', {
        templateUrl: 'views/people/create.html'
      })
      .when('/trees/:treeId/people/:personId/create', {
        templateUrl: 'views/people/create.html'
      })
      .when('/trees/:treeId/people/:personId/edit', {
        templateUrl: 'views/people/edit.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .config(['$httpProvider', function($httpProvider) {
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  }]);

angular.module('ngl2.controllers', ['ngl2.controllers.main', 'ngl2.controllers.trees', 'ngl2.controllers.people', 'ngl2.controllers.account']);
angular.module('ngl2.services', ['ngl2.services.global', 'ngl2.services.auth', 'ngl2.services.trees', 'ngl2.services.people']);
angular.module('ngl2.directives', ['ngl2.directives.tree']);