'use strict';

window.angular.module('ngl2.services.trees', [])
	.factory('Trees', ['$resource', '$rootScope', '$location', 'API_ROOT', 'Auth', function ($resource, $rootScope, $location, API_ROOT, Auth) {
		var _ = window._;
		
		var currentTree;
		var people = {};

		if (!Auth.token()) {
			$location.path('/');
		}

		function buildIndex() {
			var i = 0,
					index = [],
					person, temp;

			for(i in people) {
				person = people[i];

				temp = {
					_id: person._id,
					birth_name: person.birth_name,
					dob: person.dob,
					dod: person.dod
				};

				index.push(temp);
			}

			return index;
		}

		return {
			reset: function () {
				currentTree = undefined;
				people = {};
			},
			getPeople: function () {
				return people;
			},
			getPerson: function (id) {
				return people[id];
			},
			deletePerson: function (id) {
				delete people[id];
				return people;
			},
			updatePeople: function (modified, deleted) {
				var i = 0,
						person;

				for (i in modified) {
					person = modified[i];
					people[person._id] = person;
				}

				if (deleted) {
					// ensure array
					deleted = [].concat(deleted);
					for (i in deleted) {
						person = deleted[i];
						delete people[person._id];
					}
				}

				$rootScope._peopleIndex = buildIndex();
				return people;
			},
			resource: $resource(API_ROOT + '/trees/:treeId',
			{
				'auth_token': Auth.token()
			},
			{
				update: { method: 'PUT'},
				getData: {
					method: 'GET',
					isArray: false,
				}
			})
		};
	}]);