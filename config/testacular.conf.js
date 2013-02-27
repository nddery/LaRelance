basePath = '../';

files = [
  JASMINE,
  JASMINE_ADAPTER,
  'app/js/vendor/angular.js',
  'test/lib/angular/angular-mocks.js',
  'app/js/**/*.js',
  'test/unit/**/*.js'
];

exclude = [
  'app/js/vendor/angular.min.js',
  'app/js/vendor/bootstrap.js',
  'app/js/vendor/bootstrap.min.js',
  'app/js/vendor/jquery-1.9.1.min.js'
];

autoWatch = true;

browsers = ['Chrome'];

junitReporter = {
  outputFile: 'test_out/unit.xml',
  suite: 'unit'
};
