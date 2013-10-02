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

			$scope.updateRelation = function () {
				var params = {
					_id: $routeParams.personId,
					treeId: $routeParams.treeId,
					person: {}
				}

				params.person[inversePluralize($routeParams.action)] = [$scope.relation];

				console.log(params);
				
				new People(params).$update(function (response) {
					$location.path('trees/' + $routeParams.treeId);
				});
			};

			$scope.prepareRelatives = function () {
				//$scope._people = Trees.getPeople();
				console.log($routeParams, $scope._people);
				var root = $scope.root = $scope._people[$routeParams.personId],
						i = 0, j = 0;

				$scope.action = $routeParams.action;
				$scope.suggestedRelatives = [];

				// TBD: suggestedRelatives should only return unique values
				// 			and values not already related to root
				switch ($scope.action) {
				case 'child':
					// create a pool of potential children from existing spouse's children
					for (i in root.spouse_ids) {
						var spouse = $scope._people[root.spouse_ids[i]];

						for (j in spouse.child_ids) {
							$scope.suggestedRelatives.push($scope._people[spouse.child_ids[j]]);	
						}
					}
					break;
				case 'spouse':
					// create a pool of potential spouses from existing children's parents?
					for (i in root.child_ids) {
						var child = $scope._people[root.child_ids[i]];

						for (j in child.parent_ids) {
							$scope.suggestedRelatives.push($scope._people[child.parent_ids[j]]);	
						}
					}
					break;
				case 'parent':
					// create a pool of potential parents from existing parent's spouses
					for (i in root.parent_ids) {
						var parent = $scope._people[root.parent_ids[i]];

						for (j in parent.spouse_ids) {
							$scope.suggestedRelatives.push($scope._people[parent.spouse_ids[j]]);	
						}
					}
					break;
				}

				console.log('suggestedRelatives', $scope.suggestedRelatives);
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

				if ($routeParams.action) {
					
					switch ($routeParams.action) {
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

			function inversePluralize (option) {
				switch (option) {
				case 'child':
					return 'parents';
				case 'parent':
					return 'children';
				case 'spouse':
					return 'spouses';
				}
			}
		}]);