'use strict';

window.angular.module('ngl2.services.trees', [])
	.factory('Trees', ['$resource', function($resource) {
		return $resource('http://localhost:port/api/v1/trees/:treeId',
			{
				port: ':3000',
			  treeId: '@_id'
			},
			{
				update: { method: 'PUT'},
				getData: { method: 'GET', isArray: false }
			}
			);
	}]);