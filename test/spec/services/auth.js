'use strict';

describe('AuthService', function() {

  var $httpBackend, $rootScope, $sanitize, Auth;

  var mockCredentials = {
    email: 'test@example.com',
    password: 'password'
  };

  var mockLogin = {
    authentication_token: 'SAMPLETOKEN',
    user: {
      _id: 100,
      name: 'Test User'
    }
  };

  beforeEach(function() {
    module('ngl2');
  });

  beforeEach(inject(function ($injector) {
    Auth = $injector.get('Auth');
    $httpBackend = $injector.get('$httpBackend');
    $rootScope = $injector.get('$rootScope');
    $sanitize = $injector.get('$sanitize');

    // login mock response
    $httpBackend.when('POST', 'http://localhost:3000/api/v1/users/sign_in')
      .respond(200, mockLogin);
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should login a user', function() {
    Auth.login(mockCredentials);
    $httpBackend.flush();

    expect( Auth.user._id ).toEqual( mockLogin.user._id );
    expect( Auth.user.name ).toEqual( mockLogin.user.name );
    expect( Auth.user.token ).toEqual( mockLogin.authentication_token );

    expect( Auth.loggedIn() ).toEqual( true );

    expect( Auth.token() ).toEqual( mockLogin.authentication_token );
  });

  it('should logout a user', function() {
    Auth.login(mockCredentials);
    $httpBackend.flush();

    expect( Auth.loggedIn() ).toEqual( true );
    expect( Auth.token() ).toEqual( mockLogin.authentication_token );

    // logout mock response
    $httpBackend.when('DELETE', 'http://localhost:3000/api/v1/users/sign_out?auth_token=' + Auth.token())
      .respond(201);

    Auth.logout();
    $httpBackend.flush();

    expect( Auth.loggedIn() ).toBe( false );
    expect( Auth.token() ).toBe( undefined );
  });
});