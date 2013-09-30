'use strict';

window.angular.module('ngl2.services.people', [])
	.factory('People', ['$resource', function($resource) {
		return $resource('http://localhost:port/api/v1/trees/:treeId/people/:personId',
			{
				port: ':3000',
				treeId: '@treeId',
			  personId: '@_id'
			},
			{
				update: { method: 'PUT'},
				getData: { method: 'GET', isArray: false }
			}
			);
	}]);