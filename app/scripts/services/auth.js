'use strict';

window.angular.module('ngl2.services.auth', ['ngCookies'])
	.factory('Auth', ['$http', '$cookieStore', '$rootScope', '$sanitize', 'HTTP_API_ROOT', function ($http, $cookieStore, $rootScope, $sanitize, HTTP_API_ROOT) {
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
				data: sanitizeCredentials(credentials)
			}).then(authSuccess, authError);
		};

		AuthService.register = function (credentials) {
			$http({
				method: 'POST',
				url: HTTP_API_ROOT + '/users',
				data: {
					user: sanitizeCredentials(credentials)
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

		var sanitizeCredentials = function (credentials) {
			var sanitized = {
				email: $sanitize(credentials.email),
				password: $sanitize(credentials.password)
			};

			// login only
			if (credentials.remember) {
				sanitized.remember = $sanitize(credentials.remember);
			}

			// registration only
			if (credentials.passwordConfirm) {
				sanitized.password_confirmation = $sanitize(credentials.passwordConfirm);
			}

			return sanitized;
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