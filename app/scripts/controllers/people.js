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
					treeId: $routeParams.treeId,
					auth_token: authToken,
					person: $scope.person
				};

				$http.put('http://localhost:3000/api/v1/trees/' + $routeParams.treeId + '/people/' + $routeParams.personId, params)
					.success(function(data, status) {
						console.log('update success ', data, status);
						$location.path('trees/' + $routeParams.treeId);
					});

				// var person = People.get({ auth_token: authToken, treeId: $routeParams.treeId, personId: $routeParams.personId }, function() {
				// 	person.birth_name = $scope.person.birth_name;
				// 	person.$save(function (response) {
				// 		console.log('person update resp', response);
				// 		//Trees.updatePeople()
				// 		$location.path('trees/' + $routeParams.treeId);
				// 	});
				// });
			};

			$scope.destroy = function() {
				$http.delete('http://localhost:3000/api/v1/trees/' + $routeParams.treeId + '/people/' + $routeParams.personId + '?auth_token=' + authToken)
					.success(function(data, status) {
						console.log('delete success ', data, status);
						$location.path('trees/' + $routeParams.treeId);
					});
			};

			$scope.showForm = function (options) {
				
				$location
					.search('action', options.create)
					.path('trees/' + options.root.tree_id + '/people/' + options.root._id + '/create');
				console.log('show form', options);
			};

			$scope.create = function () {
				
				var params = {
					'treeId': $routeParams.treeId,
					'auth_token': authToken,
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
					console.log('person save resp', response);
					$location.path('trees/' + $routeParams.treeId);
				});
			};
		}]);