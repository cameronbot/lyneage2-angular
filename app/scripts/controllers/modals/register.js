'use strict';

window.angular.module('ngl2.controllers.register', ['ui.bootstrap'])
.controller('RegisterModalCtrl', ['$scope', '$modal', '$location', '$log', 'Auth', function ($scope, $modal, $location, $log, Auth) {
  
  $scope.loggedIn = !!Auth.token();
  $scope.logout = function () {
    Auth.logout(function () {
      $scope.loggedIn = !!Auth.token();
      $location.path('/');
    });
  };

  $scope.modalOpen = function () {
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
.controller('RegisterInstanceCtrl', ['$scope', '$modalInstance', 'credentials', function ($scope, $modalInstance, credentials) {
  
  $scope.credentials = credentials;

  $scope.$on('switch', function (action) {
    if (action == 'login') {
      $modalInstance.dismiss('cancel');
    }
  });

  $scope.switch = function () {
    $scope.$emit('switch', 'login');
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.login = function () {
    $modalInstance.close($scope.credentials);
  };
}]);