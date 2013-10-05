'use strict';

window.angular.module('ngl2.services.auth', ['ngCookies'])
	.factory('Auth', ['$http', '$cookieStore', function ($http, $cookieStore) {
		var authToken,
				user;

		var login = function (email, pass, remember, callback) {
			$http({
				method: 'POST',
				url: 'http://localhost:3000/api/v1/users/sign_in',
				data: {
					email: email,
					password: pass,
					'remember_me': remember
				}
			})
			.success(function(data) {
				authToken = data.authentication_token;
				user = data.user;
				console.log('user data set', data);

				$cookieStore.put('token', authToken);
				$cookieStore.put('user', user);

				console.log($cookieStore.get('token'));
				callback();
			});
		};

		var register = function (email, pass, passConfirm, callback) {
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
			.success(function(data) {
				authToken = data.authentication_token;
				user = data.user;
				console.log('user data set', data);

				$cookieStore.put('token', authToken);
				$cookieStore.put('user', user);

				console.log($cookieStore.get('token'));
				callback();
			});
		};

		var logout = function (callback) {
			$http({
				method: 'DELETE',
				url: 'http://localhost:3000/api/v1/users/sign_out?auth_token=' + authToken
			})
			.success(function() {
				authToken = undefined;
				user = undefined;
				console.log('user data cleared');

				$cookieStore.put('token', authToken);
				$cookieStore.put('user', user);

				console.log($cookieStore.get('token'));
				callback();
			});
		};

		return {
			token: function() {
				if(!authToken) authToken = $cookieStore.get('token');

				return authToken;
			},
			user: function() {
				if(!user) user = $cookieStore.get('user');

				return user;
			},
			isSignedIn: function() {
				return !!user;
			},
			login: login,
			logout: logout,
			register: register
		};
	}]);