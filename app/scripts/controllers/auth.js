'use strict';

window.angular.module('ngl2.controllers.auth', [])
	.controller('AuthCtrl', ['$scope','$routeParams','$location','Global','Auth',
		function($scope, $routeParams, $location, Global, Auth) {

			$scope.email = 'cameron.hill@gmail.com';
			$scope.password = '';
			$scope.remember = false;

			$scope.login = function () {
				console.log('triggered submit');
				Auth.login($scope.email, $scope.password, $scope.remember, function() {
					$location.path('trees');
				});
			};
		}]);