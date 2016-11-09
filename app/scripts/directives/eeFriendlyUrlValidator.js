'use strict';

angular.module('eagleeye')

/**
 * @ngdoc directive
 * @name eagleeye.directive:eeFriendlyUrlValidator
 * @requires eagleeye.EagleEyeWebService
 */
.directive('eeFriendlyUrlValidator', [
  'EagleEyeWebService',
  function(EagleEyeWebService) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function eeFriendlyUrlValidatorPostLinkFn($scope, $element, $attrs, ngModel) {
        var type = $attrs.eeFriendlyUrlValidator,
          params = {
            'chart': {
              method: 'getChartById',
              prefix: 'c-'
            },
            'chartset': {
              method: 'getChartSetById',
              prefix: 's-'
            }
          };

        ngModel.$parsers.push(validator);

        function validator(friendlyUrl) {
          if (!friendlyUrl || friendlyUrl.length === 0)  return;

          ngModel.$setValidity('friendlyUrlChecking', false);
          ngModel.$setValidity('friendlyUrlAvailable', true);

          EagleEyeWebService[params[type].method](params[type].prefix + friendlyUrl)
            .then(function(data) {
              ngModel.$setValidity('friendlyUrlChecking', true);
              ngModel.$setValidity('friendlyUrlAvailable', false);

            }, function(error) {
              ngModel.$setValidity('friendlyUrlChecking', true);
              ngModel.$setValidity('friendlyUrlAvailable', true);
            });

          return friendlyUrl;
        }
      }
    };
  }
]);
