/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp({
  fingerprint: {
    prepend: 'https://assets.retirementplan.io/'
  }
});

// Use `app.import` to add additional libraries to the generated
// output files.
//
// If you need to use different assets in different
// environments, specify an object as the first parameter. That
// object's keys should be the environment name and the values
// should be the asset to use in that environment.
//
// If the library that you are including contains AMD or ES6
// modules that you would like to import into your application
// please specify an object with the list of modules as keys
// along with the exports of each module as its value.

/*
BKP Adds
*/

if (app.env === 'test') { // ONLY TEST
  // Used for faking responses in tests
  app.import('vendor/route-recognizer/dist/route-recognizer.js');
  app.import('vendor/FakeXMLHttpRequest/fake_xml_http_request.js');
  app.import('vendor/pretender/pretender.js');
}

if (app.env === 'development') { // ONLY DEVELOPMENT
  app.import('bower_components/ember-debug/ember-debug.js'); // https://github.com/aexmachina/ember-debug
}

/* Additional CSS (goes to vendor.css) */
app.import('bower_components/ember-notify/dist/ember-notify.css');
app.import('bower_components/ember-spin-box/dist/ember-spin-box.css');
app.import('bower_components/ember-date-picker/dist/ember-date-picker.css');
app.import('bower_components/font-awesome/css/font-awesome.min.css');
app.import('bower_components/c3/c3.css');

/* General purpose Javascript libraries */
app.import('bower_components/momentjs/moment.js');
app.import('bower_components/accounting/accounting.js');
app.import('bower_components/lodash/dist/lodash.min.js');
app.import('bower_components/fastclick/lib/fastclick.js');
app.import('bower_components/headroom.js/dist/headroom.js');
app.import('bower_components/d3/d3.js');
app.import('bower_components/c3/c3.js');

/* Ember-specific Javascript libraries */
app.import('bower_components/ember-notify/dist/named-amd/main.js', {
  exports: { 'ember-notify': ['default'] }
});
app.import('bower_components/ember-simple-auth/ember-simple-auth.js');
app.import('bower_components/ember-google-analytics/ember-google-analytics.js');
app.import('bower_components/ember-validations/index.js');
app.import('bower_components/ember-forms/dist/globals/main.js');
app.import('bower_components/ember-spin-box/dist/ember-spin-box.js');
app.import('bower_components/ember-date-picker/dist/ember-date-picker.js'); // after moment.js

// Standard Bootstrap javascript
['transition.js', 'dropdown.js', 'collapse.js', 'modal.js', 'tooltip.js', 'popover.js', 'alert.js'].forEach(function(path) {
  var fullPath = 'bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/' + path;
  app.import(fullPath);
});

/* Import bootstrap fonts */
['glyphicons-halflings-regular.ttf', 'glyphicons-halflings-regular.woff', 'glyphicons-halflings-regular.eot', 'glyphicons-halflings-regular.svg'].forEach(function(path) {
  var fullPath = 'bower_components/bootstrap-sass-official/vendor/assets/fonts/bootstrap/' + path;
  app.import(fullPath, {
    destDir: '/fonts/bootstrap'
  });
});
/* */

/* Import fontawesome */
['fontawesome-webfont.ttf', 'fontawesome-webfont.woff', 'fontawesome-webfont.eot', 'FontAwesome.otf', 'fontawesome-webfont.svg'].forEach(function(path) {
  var fullPath = 'bower_components/font-awesome/fonts/' + path;
  app.import(fullPath, {
    destDir: '/fonts'
  });
});
/* */


/* */
module.exports = app.toTree();
/* */
