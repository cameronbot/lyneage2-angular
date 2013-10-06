'use strict';

window.angular.module('ngl2.services.auth', ['ngCookies'])
	.factory('Auth', ['$http', '$cookieStore', function ($http, $cookieStore) {
		var AuthService = {};

		AuthService.user = $cookieStore.get('user') || {};
		
		AuthService.token = function () {
			return AuthService.user.token;
		};

		AuthService.loggedIn = function () {
			return AuthService.user && AuthService.user.token;
		};

		AuthService.login = function (email, pass, remember, callback) {
			$http({
				method: 'POST',
				url: 'http://localhost:3000/api/v1/users/sign_in',
				data: {
					email: email,
					password: pass,
					'remember_me': remember
				}
			})
			.success(function (data) {
				successCallback.call(this, data, callback);
			});
		};

		AuthService.register = function (email, pass, passConfirm, callback) {
			$http({
				method: 'POST',
				url: 'http://localhost:3000/api/v1/users',
				data: {
					user: {
						email: email,
						password: pass,
						password_confirmation: passConfirm	
					}
				}
			})
			.success(function (data) {
				successCallback.call(this, data, callback);
			});
		};

		AuthService.logout = function (callback) {
			$http({
				method: 'DELETE',
				url: 'http://localhost:3000/api/v1/users/sign_out?auth_token=' + AuthService.token()
			})
			.success(function() {
				AuthService.user = {};
				$cookieStore.put('user', AuthService.user);
				callback();
			});
		};

		var successCallback = function(data, callback) {
			data.user.token = data.authentication_token;
			AuthService.user = data.user;

			$cookieStore.put('user', AuthService.user);

			if (callback) { callback(); }
		};

		return AuthService;
	}]);