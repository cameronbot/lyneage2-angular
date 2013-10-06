'use strict';

window.angular.module('ngl2.services.trees', [])
	.factory('Trees', ['$resource', '$rootScope', '$location', 'Auth', function ($resource, $rootScope, $location, Auth) {
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
			resource: $resource('http://localhost:port/api/v1/trees/:treeId',
			{
				'port': ':3000',
				'auth_token': Auth.token(),
			  'treeId': '@_id'
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