'use strict';

window.angular.module('ngl2.controllers.account', ['ui.bootstrap'])
.controller('AccountCtrl', ['$scope', '$rootScope', '$modal', '$location', '$route', '$log', 'Auth', function ($scope, $rootScope, $modal, $location, $route, $log, Auth) {

  $scope.loggedIn = Auth.loggedIn;

  $scope.logout = function () {
    Auth.logout(function () {
      $location.path('/');
    });
  };

  $scope.login = function () {
    var modalInstance = $modal.open({
      templateUrl: 'views/auth/login.html',
      controller: 'LoginInstanceCtrl',
      windowClass: 'show',
      resolve: {
        credentials: function () {
          return $scope.credentials;
        }
      }
    });

    modalInstance.result.then(function (credentials) {
      console.log('submitted creds', credentials);

      Auth.login(credentials.email, credentials.password, credentials.remember, function() {
        console.log('switch to trees', Auth.token());
        $location.path('trees');
      });
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.register = function () {
    var modalInstance = $modal.open({
      templateUrl: 'views/auth/register.html',
      controller: 'RegisterInstanceCtrl',
      windowClass: 'show',
      resolve: {
        credentials: function () {
          return $scope.credentials;
        }
      }
    });

    modalInstance.result.then(function (credentials) {
      console.log('submitted creds', credentials);

      Auth.register(credentials.email, credentials.password, credentials.passwordConfirm, function() {
        $location.path('trees');
      });
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
}])
.controller('LoginInstanceCtrl', ['$scope', '$modalInstance', 'credentials', function ($scope, $modalInstance, credentials) {
  
  $scope.credentials = credentials;
  
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.login = function () {
    $modalInstance.close($scope.credentials);
  };
}])
.controller('RegisterInstanceCtrl', ['$scope', '$modalInstance', 'credentials', function ($scope, $modalInstance, credentials) {
  
  $scope.credentials = credentials;

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.login = function () {
    $modalInstance.close($scope.credentials);
  };
}]);