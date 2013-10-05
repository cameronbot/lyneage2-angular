'use strict';

window.angular.module('ngl2.controllers.login', ['ui.bootstrap'])
.controller('LoginModalCtrl', ['$scope', '$modal', '$location', '$log', 'Auth', function ($scope, $modal, $location, $log, Auth) {

  $scope.loggedIn = !!Auth.token();
  $scope.logout = function () {
    Auth.logout(function () {
      $scope.loggedIn = !!Auth.token();
      $location.path('/');
    });
  };

  // TODO: combine register and login modals into one template and controller

  $scope.modalOpen = function () {
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
        $location.path('trees');
      });
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
}])
.controller('LoginInstanceCtrl', ['$scope', '$modalInstance', 'credentials', function ($scope, $modalInstance, credentials) {
  
  $scope.credentials = credentials;
  
  $scope.$on('switch', function (action) {
    if (action == 'register') {
      $modalInstance.dismiss('cancel');
    }
  });

  $scope.switch = function () {
    $scope.$emit('switch', 'register');
  };


  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.login = function () {
    $modalInstance.close($scope.credentials);
  };
}]);