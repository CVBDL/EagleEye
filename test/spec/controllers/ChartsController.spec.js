'use strict';

describe('Controller: ChartsController', function() {
  var $controller,
    $httpBackend,
    $q,
    $rootScope,
    $state,
    EagleEyeWebService,
    DeleteConfirmationService;

  var ChartsController;

  // load main module
  beforeEach(module('eagleeye'));

  // load EagleEyeWebService mock module
  beforeEach(module('EagleEyeWebServiceMock'));

  // mock dependent services
  beforeEach(module(function($provide) {
    $provide.factory('DeleteConfirmationService', function($q) {
      var qShowConfirmDialog;

      var showConfirmDialog = jasmine.createSpy('showConfirmDialog').and.callFake(function(config) {
        qShowConfirmDialog = $q.defer();

        return qShowConfirmDialog.promise;
      });

      return {
        showConfirmDialog: showConfirmDialog,
        resolveShowConfirmDialog: function(value) { qShowConfirmDialog.resolve(value); },
        rejectShowConfirmDialog: function(reason) { qShowConfirmDialog.reject(reason); }
      };
    });
  }));

  // reset router
  beforeEach(module(function($urlRouterProvider) {
    $urlRouterProvider.otherwise(function() { return false; });
  }));

  // inject services
  beforeEach(inject(function(_$controller_, _$q_, _$rootScope_, _$state_, _$httpBackend_, _EagleEyeWebService_, _DeleteConfirmationService_) {
    $controller = _$controller_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $state = _$state_;
    $httpBackend = _$httpBackend_;
    EagleEyeWebService = _EagleEyeWebService_;
    DeleteConfirmationService = _DeleteConfirmationService_;
  }));

  beforeEach(inject(function() {
    ChartsController = $controller('ChartsController', {
      $state: $state,
      EagleEyeWebService: EagleEyeWebService,
      DeleteConfirmationService: DeleteConfirmationService
    });
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should be able to create controller', function() {
    expect(ChartsController).toBeDefined();
  });

  it('should set default isLoading model', function() {
    expect(ChartsController.isLoading).toBe(true);
  });

  it('should call init() to initialize controller', function() {
    expect(EagleEyeWebService.getCharts).toHaveBeenCalled();
    EagleEyeWebService.resolveGetCharts([]);
    $rootScope.$digest();
    expect(ChartsController.isLoading).toBe(false);
    expect(ChartsController.chartList).toEqual([]);
  });

  describe('init()', function() {
    it('should call loadChartList() to fetch charts', function() {
      ChartsController.init();
      expect(EagleEyeWebService.getCharts).toHaveBeenCalled();
    });
  });

  describe('loadChartList()', function() {
    it('should call EagleEyeWebService service to fetch charts from server', function() {
      ChartsController.loadChartList();
      expect(EagleEyeWebService.getCharts).toHaveBeenCalled();
    });

    it('should set isLoading to false and refresh chartList after fetching charts', function() {
      ChartsController.loadChartList();
      expect(EagleEyeWebService.getCharts).toHaveBeenCalled();
      EagleEyeWebService.resolveGetCharts([]);
      $rootScope.$digest();
      expect(ChartsController.isLoading).toBe(false);
      expect(ChartsController.chartList).toEqual([]);
    });
  });

  describe('onClickDeleteChart()', function() {
    var $event,
      chart;

    beforeEach(function() {
      spyOn(ChartsController, 'loadChartList');

      $event = {
        stopPropagation: jasmine.createSpy('stopPropagation')
      };

      chart = {
        _id: 'id',
        options: { title: 'title' }
      }
    });

    it('should stop default event propagation', function() {
      ChartsController.onClickDeleteChart($event, chart);
      expect($event.stopPropagation).toHaveBeenCalled();
    });

    it('should show confirm dialog before delete', function() {
      ChartsController.onClickDeleteChart($event, chart);
      expect(DeleteConfirmationService.showConfirmDialog).toHaveBeenCalledWith({ title: 'title' });
    });

    it('should cancel delete if user click cancel', function() {
      ChartsController.onClickDeleteChart($event, chart);
      DeleteConfirmationService.rejectShowConfirmDialog();
      $rootScope.$digest();
      expect(EagleEyeWebService.deleteChartById).not.toHaveBeenCalled();
      expect(ChartsController.loadChartList).not.toHaveBeenCalled();
    });

    it('should delete the chart if user click ok', function() {
      ChartsController.onClickDeleteChart($event, chart);
      DeleteConfirmationService.resolveShowConfirmDialog();
      $rootScope.$digest();
      expect(EagleEyeWebService.deleteChartById).toHaveBeenCalledWith('id');
    });

    it('should refresh chart list after delete a chart', function() {
      ChartsController.onClickDeleteChart($event, chart);
      DeleteConfirmationService.resolveShowConfirmDialog();
      $rootScope.$digest();
      EagleEyeWebService.resolveDeleteChartById();
      $rootScope.$digest();
      expect(ChartsController.loadChartList).toHaveBeenCalled();
    });
  });

  describe('createChart()', function() {
    it('should go to chartCreation state', function() {
      spyOn($state, 'go');

      ChartsController.createChart();
      expect($state.go).toHaveBeenCalledWith('chartCreation');
    });
  });
});
