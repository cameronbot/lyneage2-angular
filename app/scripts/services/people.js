'use strict';

window.angular.module('ngl2.services.people', [])
	.factory('People', ['$resource', 'API_ROOT', 'Auth', function($resource, API_ROOT, Auth) {
		var authToken = Auth.token();

		return $resource(API_ROOT + '/trees/:treeId/people/:personId',
			{
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