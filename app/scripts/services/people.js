'use strict';

window.angular.module('ngl2.services.people', [])
	.factory('People', ['$resource', 'Auth', function($resource, Auth) {
		var authToken = Auth.token();

		return $resource('http://localhost:port/api/v1/trees/:treeId/people/:personId',
			{
				'port': ':3000',
				'auth_token': authToken,
				'treeId': '@treeId',
			  'personId': '@_id'
			},
			{
				update: { method: 'PUT' },
				getData: { method: 'GET', isArray: false }
			}
		);
	}]);