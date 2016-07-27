'use strict';

/**
 * @ngdoc function
 * @name eagleeye.controller:ChartsController
 * @description
 * # ChartsController
 * Controller of the eagleeye
 */
angular.module('eagleeye')
  .controller('ChartsController', [
    '$state',
    '$mdDialog',
    '$mdMedia',
    '$http',
    'EagleEyeWebService',
    'eeDeleteConfirmationService',
    function($state, $mdDialog, $mdMedia, $http, EagleEyeWebService, eeDeleteConfirmationService) {
      var controller = this;

      this.getChartsList = function() {
        EagleEyeWebService.getCharts().then(function(chartList) {
          controller.chartList = chartList;
        });
      };

      controller.getChartsList();

      this.showConfirm = function($event, id) {
        $event.stopPropagation();

        eeDeleteConfirmationService.showDeleteConfirmationDialog().then(function(response) {
          if (response === 'delete') {
            controller.deleteChartById(id);
          }
        });
      };

      this.openCharts = function(id, friendlyurl) {
        if (friendlyurl) {
          $state.go('chart', { id: friendlyurl });
        } else {
          $state.go('chart', { id: id });
        }
      };

      this.deleteChartById = function(id) {
        EagleEyeWebService.deleteChartById(id).then(function() {
          controller.getChartsList();
        });
      };

      this.goToSettings = function($event, id, friendlyurl, type) {
        $event.stopPropagation();

        if (friendlyurl) {
          $state.go('chartSettings', { id: friendlyurl, type: type });
        } else {
          $state.go('chartSettings', { id: id, type: type });
        }
      };
    }
  ]);
