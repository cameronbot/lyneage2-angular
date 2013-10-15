'use strict';

window.angular.module('ngl2.controllers.trees', [])
	.controller('TreesCtrl', ['$scope', '$rootScope', '$routeParams', '$location', 'Trees', 'Auth',
		function($scope, $rootScope, $routeParams, $location, Trees, Auth) {
			// if(!Auth.loggedIn()) {
			// 	$location.path('/');
			// 	return;
			// }

			$rootScope._people = Trees.getPeople();

			$scope.create = function () {
	      console.log('submitted trees');

	      new Trees.resource({
					name: $scope.tree.name
				}).$save(function(response) {
					$location.path('/trees/' + response.tree._id);
				});

				$scope.tree.name = '';
		  };

			$scope.find = function () {
				Trees.resource.getData(function (response) {
					$scope.trees = response.trees;
				});
			};

			$scope.findOne = function () {
				Trees.reset();
				$rootScope._peopleIndex = [];

				Trees.resource.get({ treeId: $routeParams.treeId, auth_token: Auth.token() }, function (response) {
					$rootScope.activeTree = response.tree;
					$rootScope._people = Trees.updatePeople(response.people);
				});
			};

			$scope.view = function(tree) {
				$rootScope.activeTree = tree;
				$location.path('/trees/' + tree._id);
			};

		}]);