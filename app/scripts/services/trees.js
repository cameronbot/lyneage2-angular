'use strict';

window.angular.module('ngl2.services.trees', [])
	.factory('Trees', ['$resource', 'Auth', function ($resource, Auth) {
		var authToken = Auth.token();
		var currentTree;
		var people = {};

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

				return people;
			},
			resource: $resource('http://localhost:port/api/v1/trees/:treeId',
			{
				'port': ':3000',
				'auth_token': authToken,
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