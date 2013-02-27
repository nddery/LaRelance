'use strict';

/* jasmine specs for controllers go here */

describe('Projects Controller', function() {
  describe('ProjectsListCtrl', function() {
    var scope, ctrl;

    beforeEach(function() {
      scope = {},
      ctrl = new ProjectsListCtrl(scope);
    });

    it('should create "projects" model with 5 projects', function() {
      expect(scope.projects.length).toBe(5);
    });

    it('should set the default value of orderProp model', function() {
      expect(scope.orderProp).toBe('date');
    });
  });
});
