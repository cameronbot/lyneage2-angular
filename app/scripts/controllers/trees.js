'use strict';

window.angular.module('ngl2.controllers.trees', [])
	.controller('TreesCtrl', ['$scope','$routeParams','$location', 'Trees',
		function($scope, $routeParams, $location, Trees) {

			$scope._people = Trees.getPeople();

			$scope.find = function () {
				Trees.resource.getData(function(response) {
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
				//console.log(options);
			};
		}]);