var braingular = window.angular.module('braintree-angular', []);
var braintree = require('braintree-web');

braingular.factory('$braintree', [
  'clientTokenPath',
  '$http',
  function braintreeFactory(clientTokenPath, $http) {

    var $braintree = {
      clientToken: null
    };

    angular.extend($braintree, braintree);

    $braintree.getClientToken = function() {
      return (
        $http
          .get(clientTokenPath)
          .error(function(data, status) {
            var msg = 'error fetching client token at '+clientTokenPath;
            console.error(msg, data, status);
          })
      );
    };

    $braintree.setupWithToken = function(integration, options) {
      console.log('setupWithToken', integration, JSON.stringify(options));
      $braintree.getClientToken()
        .success(function(token) {
          braintree.setup(token, integration, options);
        })
    };

    return $braintree;
  }
]);

braingular.directive('braintreeDropin', function() {
  return {
    scope: {
      options: '='
    },
    template: '<div id="braintree-dropin-container"></div>',
    controller: function($scope, $braintree) {
      var options = $scope.options || {};
      options.container = 'braintree-dropin-container';

      $braintree.setupWithToken('dropin', options);
    }
  }
});

braingular.directive('braintreePaypal', function() {
  return {
    scope: {
      options: '='
    },
    template: '<div id="braintree-paypal-container"></div>',
    controller: function($scope, $braintree) {
      var options = $scope.options || {};
      options.container = 'braintree-paypal-container';

      $braintree.setupWithToken('paypal', options);
    }
  }
});

module.exports = braingular;
