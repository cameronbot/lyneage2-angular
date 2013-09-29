'use strict';

window.angular.module('ngl2.controllers.people', [])
	.controller('PeopleCtrl', ['$scope','$routeParams','$location', 'Auth', 'Trees',
		function($scope, $routeParams, $location, Auth, Trees) {

			var authToken = Auth.token();

			$scope.showModal = function(options) {
				console.log(options);
			};
		}]);