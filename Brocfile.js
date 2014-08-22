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
  app.import('vendor/ember-debug/ember-debug.js'); // https://github.com/aexmachina/ember-debug
}

/* Additional CSS (goes to vendor.css) */
app.import('vendor/ember-notify/dist/ember-notify.css');
app.import('vendor/ember-spin-box/dist/ember-spin-box.css');
app.import('vendor/ember-date-picker/dist/ember-date-picker.css');
app.import('vendor/font-awesome/css/font-awesome.min.css');
app.import('vendor/c3/c3.css');

/* General purpose Javascript libraries */
app.import('vendor/momentjs/moment.js');
app.import('vendor/accounting/accounting.js');
app.import('vendor/lodash/dist/lodash.min.js');
app.import('vendor/fastclick/lib/fastclick.js');
app.import('vendor/headroom.js/dist/headroom.js');
app.import('vendor/d3/d3.js');
app.import('vendor/c3/c3.js');

/* Ember-specific Javascript libraries */
app.import('vendor/ember-notify/dist/named-amd/main.js', {
  exports: { 'ember-notify': ['default'] }
});
app.import('vendor/ember-simple-auth/ember-simple-auth.js');
app.import('vendor/ember-google-analytics/ember-google-analytics.js');
app.import('vendor/ember-validations/index.js');
app.import('vendor/ember-forms/dist/ember_forms.js');
app.import('vendor/ember-spin-box/dist/ember-spin-box.js');
app.import('vendor/ember-date-picker/dist/ember-date-picker.js'); // after moment.js

// Standard Bootstrap javascript
['transition.js', 'dropdown.js', 'collapse.js', 'modal.js', 'tooltip.js', 'popover.js', 'alert.js'].forEach(function(path) {
  var fullPath = 'vendor/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/' + path;
  app.import(fullPath);
});

/* Import bootstrap fonts */
['glyphicons-halflings-regular.ttf', 'glyphicons-halflings-regular.woff', 'glyphicons-halflings-regular.eot', 'glyphicons-halflings-regular.svg'].forEach(function(path) {
  var fullPath = 'vendor/bootstrap-sass-official/vendor/assets/fonts/bootstrap/' + path;
  app.import(fullPath, {
    destDir: '/fonts/bootstrap'
  });
});
/* */

/* Import fontawesome */
['fontawesome-webfont.ttf', 'fontawesome-webfont.woff', 'fontawesome-webfont.eot', 'FontAwesome.otf', 'fontawesome-webfont.svg'].forEach(function(path) {
  var fullPath = 'vendor/font-awesome/fonts/' + path;
  app.import(fullPath, {
    destDir: '/fonts'
  });
});
/* */


/* */
module.exports = app.toTree();
/* */
