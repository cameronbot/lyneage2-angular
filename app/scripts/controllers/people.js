'use strict';

window.angular.module('ngl2.controllers.people', [])
	.controller('PeopleCtrl', ['$scope','$routeParams','$location', 'Auth', 'Trees', 'People',
		function($scope, $routeParams, $location, Auth, Trees, People) {

			var authToken = Auth.token();

			$scope.showModal = function(options) {
				console.log(options);
			};

			$scope.showForm = function(options) {
				
				$location
					.search('action', options.create)
					.path('trees/' + options.root.tree_id + '/people/' + options.root._id + '/create');
				console.log('show form', options);
			};

			$scope.create = function () {
				
				var params = {
					'treeId': $routeParams.treeId,
					'auth_token': authToken,
					person: {
						'birth_name': $scope.birthname,
						gender: ($scope.gender === 'm') ? 1 : 0	
					}
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
						params.person.spouse = [$routeParams.personId];
						break;
					}
				}

				new People(params).$save(function (response) {
					console.log('person save resp', response);
					$location.path('trees/' + $routeParams.treeId);
				});
			};
		}]);