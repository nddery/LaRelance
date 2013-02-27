'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('Projects App', function() {
  describe('Projects list view', function() {
    beforeEach(function() {
      browser().navigateTo('../../app/index.html');
    });

    it('should filter the phone list as user types into the search box', function() {
      expect(repeater('.project').count()).toBe(5);

      input('query').enter('ECO');
      expect(repeater('.project').count()).toBe(1);
    });

    it('should be possible to control phone order via the drop down select box', function() {
      //let's narrow the dataset to make the test assertions shorter
      input('query').enter('data');

      expect(repeater('.project', 'Projects List').column('projects.name')).
          toEqual(["Cashmoney – Visualizing the National Hockey League",
                   "Information Overload",
                   "La Relance"]);

      // select('orderProp').option('Alphabetical');

      // expect(repeater('.phones li', 'Phone List').column('phone.name')).
      //     toEqual(["MOTOROLA XOOM\u2122",
      //              "Motorola XOOM\u2122 with Wi-Fi"]);
    });
  });
});
