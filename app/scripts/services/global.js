'use strict';

window.angular.module('ngl2.services.global', [])
	.factory('Global', [function () {
		var GlobalService = {};

		GlobalService.API_ROOT = 'http://localhost\\:3000/api/v1';

		return GlobalService;
	}]);