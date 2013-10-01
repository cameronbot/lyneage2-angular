'use strict';

window.angular.module('ngl2.controllers.trees', [])
	.controller('TreesCtrl', ['$scope','$routeParams','$location', 'Auth', 'Trees',
		function($scope, $routeParams, $location, Auth, Trees) {

			var authToken = Auth.token();

			$scope._people = Trees.getPeople();

			$scope.find = function () {
				Trees.resource.getData({ 'auth_token': authToken }, function(response) {
					$scope.trees = response.trees;
				});
			};

			$scope.findOne = function () {
				Trees.resource.get({ 'auth_token': authToken, treeId: $routeParams.treeId }, function (response) {
					$scope.tree = response.tree;
					$scope.people = response.people;

					Trees.updatePeople(response.people);

					console.log(Trees.getPeople());
				});
			};

			$scope.create = function () {
				var tree = new Trees.resource({
					name: this.tree.name
				});

				tree.$save(function(response) {
					$location.path('/trees/' + response.id);
				});

				this.tree.name = '';
			};

			$scope.view = function(tree) {
				$scope.tree = tree;
				$location.path('/trees/' + tree._id);
			};

			$scope.showModal = function(options) {
				console.log(options);
			};
		}]);