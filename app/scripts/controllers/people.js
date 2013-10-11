'use strict';

window.angular.module('ngl2.controllers.people', [])
	.controller('PeopleCtrl', ['$scope', '$rootScope', '$routeParams','$location', '$http', '$filter', '$route', 'Auth', 'Trees', 'People',
		function($scope, $rootScope, $routeParams, $location, $http, $filter, $route, Auth, Trees, People) {

			// $rootScope._people = Trees.getPeople();
			$rootScope.activePerson = {};

			$scope.searchText = '';

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
					auth_token: Auth.token(),
					person: $scope.person
				};

				new People(params).$update(function (response) {
					$location.path('trees/' + $routeParams.treeId);
				});
			};

			$scope.addPerson = function () {
				$('.modal').modal();
			};

			$scope.addRelation = function (options) {
				var i = 0, j = 0, $ = window.$,
						root = (typeof options.root === 'string') ? $rootScope._people[options.root] : options.root;
						console.log(typeof options.root);
				console.log('add relation');
				$scope.root = root;
				$scope.person = {};
				$scope.person.living = true;
				//$rootScope.activePerson = root;
				$rootScope.action = options.create;
				$rootScope.suggestedRelatives = {
					existing: [],
					parent: [],
					child: [],
					spouse: []
				};

				$('.modal').modal();

				// TODO: suggestedRelatives should only return unique values
				// 			and values not already related to root
				switch ($rootScope.action) {
				case 'child':
					$rootScope.suggestedRelatives.child = root.spouse_ids.map(function (id) {
						return $rootScope._people[id];
					});

					// create a pool of potential children from existing spouse's children
					for (i in root.spouse_ids) {
						var spouse = $rootScope._people[root.spouse_ids[i]];

						for (j in spouse.child_ids) {
							$rootScope.suggestedRelatives.existing.push($rootScope._people[spouse.child_ids[j]]);	
						}
					}
					break;
				case 'spouse':
					$rootScope.suggestedRelatives.spouse = root.child_ids.map(function (id) {
						return $rootScope._people[id];
					});
					
					// create a pool of potential spouses from existing children's parents?
					for (i in root.child_ids) {
						var child = $rootScope._people[root.child_ids[i]];

						for (j in child.parent_ids) {
							$rootScope.suggestedRelatives.existing.push($rootScope._people[child.parent_ids[j]]);	
						}
					}
					break;
				case 'parent':
					$rootScope.suggestedRelatives.parent = root.parent_ids.map(function (id) {
						return $rootScope._people[id];
					});

					// create a pool of potential parents from existing parent's spouses
					for (i in root.parent_ids) {
						var parent = $rootScope._people[root.parent_ids[i]];

						for (j in parent.spouse_ids) {
							$rootScope.suggestedRelatives.existing.push($rootScope._people[parent.spouse_ids[j]]);
						}
					}
					break;
				}

				console.log('suggestedRelatives', $rootScope.suggestedRelatives);
			};

			$scope.updateRelation = function () {
				var params = {
					_id: $rootScope.activePerson._id,
					treeId: $routeParams.treeId,
					person: {}
				};

				params.person[inversePluralize($rootScope.action)] = [$scope.relation];

				new People(params).$update(function (response) {
					$('.modal').modal('hide');
					$rootScope._people = Trees.updatePeople(response.people);
					
					$rootScope.activePerson = response.people[0];
				});
			};

			$scope.create = function () {
				var $ = window.$,
						rootId = ($scope.root) ? $scope.root._id : $rootScope.activePerson._id;

				var params = {
					treeId: $routeParams.treeId,
					person: $scope.person
				};

				if ($rootScope.action) {
					params.person.children = [];
					params.person.parents = [];
					params.person.spouses = [];

					switch ($rootScope.action) {
					case 'child':
						params.person.parents = [rootId];
						if ($scope.additionalRelation) {
							params.person.parents.push($scope.additionalRelation);
						}
						break;
					case 'parent':
						params.person.children = [rootId];
						if ($scope.additionalRelation) {
							params.person.spouses.push($scope.additionalRelation);
						}
						break;
					case 'spouse':
						params.person.spouses = [rootId];
						params.person.children = $filter('filter')($scope.suggestedRelatives.spouse, { checked: true }).map(function (person) {
							return person._id;
						});
						
						break;
					}
				}

				$rootScope.action = undefined;
				$scope.additionalRelation = undefined;
				//$scope.newPerson = undefined;

				new People(params).$save(function (response) {
					$('.modal').modal('hide');
					$rootScope._people = Trees.updatePeople(response.people);
					console.log('we are here');
					// TODO: instead of redirecting to new person, just refresh this view
					// for some reason the graph is not getting updated with this:
					//$rootScope.activePerson = Trees.getPerson($rootScope.activePerson._id);
					//$rootScope.activePerson = response.people[response.people.length-1];
					$rootScope.activePerson.redraw = ($rootScope.activePerson.redraw || 0) + 1;
				});
			};

			$scope.destroy = function() {
				var params = {
					treeId: $routeParams.treeId,
					_id: $scope.person._id
				};

				new People(params).$delete(function (response) {
					// WARNING: when this is pulled into the same view, routeParams will not be available
					$rootScope._people = Trees.updatePeople(response.people, response.person);
					$location.path('trees/' + $routeParams.treeId);
				});
			};

			$scope.selectPerson = function (id) {
				$rootScope.activePerson = $rootScope._people[id];
			};

			$scope.setRoot = function (person) {
				var id = (typeof person === 'object') ? person._id : person;

				$rootScope.activePerson = $rootScope._people[id];
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