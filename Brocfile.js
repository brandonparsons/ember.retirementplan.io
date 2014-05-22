/* global require, module */


var EmberApp    = require('ember-cli/lib/broccoli/ember-app');
var pickFiles   = require('ember-cli/node_modules/broccoli-static-compiler');
var mergeTrees  = require('ember-cli/node_modules/broccoli-merge-trees');
var concatFiles = require('ember-cli/node_modules/broccoli-concat');


var app = new EmberApp({
  name: require('./package.json').name,
  minifyCSS: {
    enabled: true,
    options: {}
  },
  getEnvJSON: require('./config/environment')
});


/* Defaults: */
app.import('vendor/ember-data/ember-data.js');
app.import('vendor/ic-ajax/dist/named-amd/main.js', {
  'ic-ajax': [
    'default',
    'defineFixture',
    'lookupFixture',
    'raw',
    'request',
  ]
});
/* */


/* These are only compiled in development - used for faking responses in tests */
if (app.env !== 'production') {
  app.import('vendor/route-recognizer/dist/route-recognizer.js');
  app.import('vendor/FakeXMLHttpRequest/fake_xml_http_request.js');
  app.import('vendor/pretender/pretender.js');
}
/* */


/* Additional Javascript libraries */
app.import('vendor/ember-simple-auth/ember-simple-auth.js');

app.import('vendor/ember-google-analytics/ember-google-analytics.js')

app.import('vendor/lodash/dist/lodash.min.js');

app.import('vendor/fastclick/lib/fastclick.js');

// Standard Bootstrap javascript
['transition.js', 'dropdown.js', 'collapse.js', 'modal.js', 'tooltip.js', 'popover.js'].forEach(function (path) {
  var fullPath = 'vendor/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/' + path;
  app.import(fullPath);
});

// Bootstrap for ember
['bs-core.min.js', 'bs-modal.min.js', 'bs-label.min.js', 'bs-button.min.js', 'bs-basic.min.js', 'bs-popover.min.js', 'bs-progressbar.min.js'].forEach(function (path) {
  var fullPath = 'vendor/ember-addons.bs_for_ember/dist/js/' + path;
  app.import(fullPath);
});
/* */


/* Additional CSS (goes to vendor.css) */
app.import('vendor/alertify.js/themes/alertify.core.css');
app.import('vendor/alertify.js/themes/alertify.default.css');

app.import('vendor/font-awesome/css/font-awesome.min.css');
/* */


/* Import fontawesome fonts */
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


/* */
module.exports = mergeTrees([
  fontawesome,
  alertifyJS,
  helloJS,
  app.toTree() // module.exports = app.toTree();
])
/* */
