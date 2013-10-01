'use strict';

window.angular.module('ngl2.services.trees', [])
	.factory('Trees', ['$resource', function($resource) {
		var people = {};

		return {
			getPeople: function() {
				return people;
			},
			getPerson: function(id) {
				return people[id];
			},
			updatePeople: function(modified) {
				for(var i in modified) {
					var person = modified[i];
					people[person._id] = person;
				}
			},
			resource: $resource('http://localhost:port/api/v1/trees/:treeId',
			{
				port: ':3000',
			  treeId: '@_id'
			},
			{
				update: { method: 'PUT'},
				getData: { method: 'GET', isArray: false }
			})
		};
	}]);