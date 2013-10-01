'use strict';

window.angular.module('ngl2.controllers.people', [])
	.controller('PeopleCtrl', ['$scope','$routeParams','$location', '$http', 'Auth', 'Trees', 'People',
		function($scope, $routeParams, $location, $http, Auth, Trees, People) {

			var authToken = Auth.token();

			$scope._people = Trees.getPeople();

			$scope.showModal = function (options) {
				console.log(options);
			};

			$scope.editForm = function (person) {
				$location.path('trees/' + person.tree_id + '/people/' + person._id + '/edit');
			};

			$scope.edit = function () {
				$scope.person = Trees.getPerson($routeParams.personId);
				
				if($scope.person === undefined) {
					$location.path('trees/' + $routeParams.treeId);
				}
			};

			$scope.update = function () {
				var params = {
					_id: $scope.person._id,
					treeId: $routeParams.treeId,
					auth_token: authToken,
					person: $scope.person
				};

				new People(params).$update(function (response) {
					$location.path('trees/' + $routeParams.treeId);
				});
			};



			$scope.showForm = function (options) {
				$location
					.search('action', options.create)
					.path('trees/' + options.root.tree_id + '/people/' + options.root._id + '/create');
			};

			$scope.create = function () {
				
				var params = {
					treeId: $routeParams.treeId,
					person: $scope.person
				};

				console.log('action', $routeParams.action);

				if($routeParams.action) {
					
					switch($routeParams.action) {
					case 'child':
						params.person.children = [$routeParams.personId];
						break;
					case 'parent':
						params.person.parents = [$routeParams.personId];
						break;
					case 'spouse':
						params.person.spouses = [$routeParams.personId];
						break;
					}
				}

				new People(params).$save(function (response) {
					$location.path('trees/' + $routeParams.treeId);
				});
			};

			$scope.destroy = function() {
				var params = {
					treeId: $routeParams.treeId,
					_id: $scope.person._id
				};

				new People(params).$delete(function (response) {
					$location.path('trees/' + $routeParams.treeId);
				});
			};
		}]);