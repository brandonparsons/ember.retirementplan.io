/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp({
  name: require('./package.json').name,

  // for some large projects, you may want to uncomment this (for now)
  es3Safe: true,

  minifyCSS: {
    enabled: true,
    options: {}
  },

  getEnvJSON: require('./config/environment')
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

app.import({
  development: 'vendor/ember-data/ember-data.js',
  production:  'vendor/ember-data/ember-data.prod.js'
}, {
  'ember-data': [
    'default'
  ]
});

app.import('vendor/ic-ajax/dist/named-amd/main.js', {
  'ic-ajax': [
    'default',
    'defineFixture',
    'lookupFixture',
    'raw',
    'request',
  ]
});

// module.exports = app.toTree();

/*
BKP Adds
*/

var pickFiles   = require('ember-cli/node_modules/broccoli-static-compiler');
var mergeTrees  = require('ember-cli/node_modules/broccoli-merge-trees');
var concatFiles = require('ember-cli/node_modules/broccoli-concat');

/* These are only compiled in development */
if (app.env !== 'production') {

  // Used for faking responses in tests
  app.import('vendor/route-recognizer/dist/route-recognizer.js');
  app.import('vendor/FakeXMLHttpRequest/fake_xml_http_request.js');
  app.import('vendor/pretender/pretender.js');

  // https://github.com/aexmachina/ember-debug
  app.import('vendor/ember-debug/ember-debug.js');
}
/* */


/* Additional CSS (goes to vendor.css) */
app.import('vendor/alertify.js/themes/alertify.core.css');
app.import('vendor/alertify.js/themes/alertify.default.css');
app.import('vendor/ember-spin-box/dist/ember-spin-box.css');
app.import('vendor/ember-date-picker/dist/ember-date-picker.css');
app.import('vendor/font-awesome/css/font-awesome.min.css');
app.import('vendor/ember-charts/dist/ember-charts.css');


/* Additional Javascript libraries */

app.import('vendor/momentjs/moment.js');
app.import('vendor/lodash/dist/lodash.min.js');
app.import('vendor/fastclick/lib/fastclick.js');

app.import('vendor/ember-simple-auth/ember-simple-auth.js');
app.import('vendor/ember-google-analytics/ember-google-analytics.js');
app.import('vendor/ember-validations/index.js');
app.import('vendor/ember-forms/dist/ember_forms.js');
app.import('vendor/ember-spin-box/dist/ember-spin-box.js');
app.import('vendor/ember-date-picker/dist/ember-date-picker.js'); // after moment.js
app.import('vendor/ember-charts/dependencies/ember-addepar-mixins/resize_handler.js');
app.import('vendor/ember-charts/dist/ember-charts.js');

// Standard Bootstrap javascript
['transition.js', 'dropdown.js', 'collapse.js', 'modal.js', 'tooltip.js', 'popover.js', 'alert.js'].forEach(function (path) {
  var fullPath = 'vendor/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/' + path;
  app.import(fullPath);
});

/* Import fontawesome */
var fontawesome = pickFiles('vendor/font-awesome/', {
  srcDir: '/fonts',
  // files: isn't strictly necessary (if left out will load all files), but
  // leaving in to be explicit.
  files: [
    'fontawesome-webfont.ttf',
    'fontawesome-webfont.woff',
    'fontawesome-webfont.eot',
    'FontAwesome.otf',
    'fontawesome-webfont.svg'
  ],
  destDir: '/fonts'
});
/* */

/* Import d3 onto the window. ember-charts needs it available, and dont know */
/* how to refernce a global inside that script */
var d3 = pickFiles('vendor/d3', {
  srcDir:   '/',
  files:    ['d3.min.js'],
  destDir:  '/assets/vendor'
});
/* */

/* Import alertify (this is an un-named AMD module, just load into the window.) */
/* In the future, ember-cli may handle un-named modules. */
var alertifyJS = pickFiles('vendor/alertify.js', {
  srcDir:   '/lib',
  files:    ['alertify.min.js'],
  destDir:  '/assets/vendor'
});
/* */

/* Import hello.js (this is an un-named AMD module, just load into the window.) */
/* In the future, ember-cli may handle un-named modules. */
var helloJS = pickFiles('vendor/hello', {
  srcDir:   '/dist',
  files:    ['hello.all.min.js'],
  destDir: '/assets/vendor'
});
/* */

/* Import headroom.js (no AMD package, just load into the window.) */
var headroom = pickFiles('vendor/headroom.js', {
  srcDir:   '/dist',
  files:    ['headroom.min.js'],
  destDir: '/assets/vendor'
});
/* */


/* */
module.exports = mergeTrees([
  fontawesome,
  d3,
  alertifyJS,
  helloJS,
  headroom,
  app.toTree()
]);
/* */
