'use strict';

describe('AuthService', function() {

  var $httpBackend, $rootScope, Auth;

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
    $rootScope = $injector.get('$rootScope');

    // login mock response
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
      expect( Auth.user._id ).toEqual( mockLogin.user._id );
      expect( Auth.user.name ).toEqual( mockLogin.user.name );
      expect( Auth.user.token ).toEqual( mockLogin.authentication_token );

      expect( Auth.loggedIn() ).toEqual( true );

      expect( Auth.token() ).toEqual( mockLogin.authentication_token );
    });
  });

  it('should logout a user', function () {
    Auth.login('email', 'pass', null, function () {
      expect( Auth.loggedIn() ).toEqual( true );
      expect( Auth.token() ).toEqual( mockLogin.authentication_token );

      // logout mock response
      $httpBackend.when('DELETE', 'http://localhost\\:3000/api/v1/users/sign_out?auth_token=' + Auth.token())
        .respond(201, {});

      Auth.logout(function () {
        expect( Auth.loggedIn() ).toBe( false );
        expect( Auth.token() ).toBe( undefined );
      });
    });
  });
});