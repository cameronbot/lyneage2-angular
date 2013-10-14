'use strict';

window.angular.module('ngl2.services.auth', ['ngCookies'])
	.factory('Auth', ['$http', '$cookieStore', '$rootScope', 'HTTP_API_ROOT', function ($http, $cookieStore, $rootScope, HTTP_API_ROOT) {
		var AuthService = {};

		AuthService.user = $cookieStore.get('user') || {};

		AuthService.token = function () {
			return AuthService.user.token;
		};

		AuthService.loggedIn = function () {
			return !!( AuthService.user && AuthService.user.token );
		};

		AuthService.login = function (credentials) {
			return $http({
				method: 'POST',
				url: HTTP_API_ROOT + '/users/sign_in',
				data: {
					email: credentials.email,
					password: credentials.password,
					remember_me: credentials.remember
				}
			}).then(authSuccess, authError);
		};

		AuthService.register = function (credentials) {
			$http({
				method: 'POST',
				url: HTTP_API_ROOT + '/users',
				data: {
					user: {
						email: credentials.email,
						password: credentials.password,
						password_confirmation: credentials.passwordConfirm
					}
				}
			}).then(authSuccess, authError);
		};

		AuthService.logout = function (callback) {
			return $http({
				method: 'DELETE',
				url: HTTP_API_ROOT + '/users/sign_out?auth_token=' + AuthService.token()
			})
			.then(function (response) {
				AuthService.user = {};
				$cookieStore.put('user', AuthService.user);

	      $rootScope.activeTree = undefined;
	      $rootScope.activePerson = undefined;
	      $rootScope._people = undefined;
			});
		};

		var authSuccess = function (response) {
			AuthService.user = response.data.user;
			AuthService.user.token = response.data.authentication_token;

			$cookieStore.put('user', AuthService.user);

			return AuthService.user;
		};

		var authError = function (response) {
			return response.data;
		};

		return AuthService;
	}]);