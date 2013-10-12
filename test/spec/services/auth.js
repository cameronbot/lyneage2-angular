'use strict';

describe('AuthService', function() {

  var $httpBackend, Auth;

  var mockLogin = {
    authentication_token: 'ABCDEFG',
    user: {
      _id: 100,
      name: 'Test User'
    }
  };

  beforeEach(function () {
    module('ngl2');
  });

  beforeEach(inject(function ($injector) {
    Auth = $injector.get('Auth');
    $httpBackend = $injector.get('$httpBackend');

    // login
    $httpBackend.when('POST', 'http://localhost\\:3000/api/v1/users/sign_in')
      .respond(200, mockLogin);
  }));

  afterEach(function () {
    $httpBackend.flush();
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should login a user', function () {
    Auth.login('email', 'pass', null, function () {
      expect(Auth.user._id).toEqual(mockLogin.user._id);
      expect(Auth.user.name).toEqual(mockLogin.user.name);
      expect(Auth.user.token).toEqual(mockLogin.authentication_token);
    });
  });

});