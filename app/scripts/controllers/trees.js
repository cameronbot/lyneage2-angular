'use strict';

window.angular.module('ngl2.controllers.trees', [])
	.controller('TreesCtrl', ['$scope', '$rootScope', '$routeParams', '$location', 'Trees', 'Auth',
		function($scope, $rootScope, $routeParams, $location, Trees, Auth) {
			if(!Auth.loggedIn()) {
				$location.path('/');
				return;
			}

			$rootScope._people = Trees.getPeople();

			$scope.create = function () {
	      console.log('submitted trees');

	      var tree = new Trees.resource({
					name: $scope.tree.name
				});

				tree.$save(function(response) {
					$location.path('/trees/' + response.tree._id);
				});

				$scope.tree.name = '';
		  };

			$scope.find = function () {
				Trees.resource.getData({ auth_token: Auth.token()} ,function(response) {
					$scope.trees = response.trees;
				});
			};

			$scope.findOne = function () {
				Trees.resource.get({ treeId: $routeParams.treeId }, function (response) {
					$scope.tree = response.tree;
					$scope.people = response.people;

					Trees.updatePeople(response.people);
				});
			};

			// $scope.create = function () {
			// 	var tree = new Trees.resource({
			// 		name: this.tree.name
			// 	});

			// 	tree.$save(function(response) {
			// 		$location.path('/trees/' + response.id);
			// 	});

			// 	this.tree.name = '';
			// };

			$scope.view = function(tree) {
				$scope.tree = tree;
				$location.path('/trees/' + tree._id);
			};

		}]);