/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
      rootElement: '#ember-application'
    },

    debug: false
  };

  if (environment === 'development') {
    ENV.baseURL               = '/';
    ENV.apiHost               = 'http://rp-rails.dev/api';
    ENV.LOG_EVENT_TRACKING    = true;
    ENV.debug                 = true;
    ENV.ga_tracking_code      = 'UA-XXX-DEVELOPMENT';
    ENV.ga_domain             = 'retirementplan.io';
    ENV.facebook_app_id       = '649704131751768';
    ENV.google_client_id      = '473904766177-cataubhq5mhaqadd9j3gjil8i02omft3.apps.googleusercontent.com';

    ENV.APP.LOG_ACTIVE_GENERATION = true;
    ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV.LOG_MODULE_RESOLVER = true; // False in ember-cli, but haven't upgraded to ember 1.6 yet, so can't turn off
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
  }

  if (environment === 'test') {

  }

  if (environment === 'production') {
    ENV.baseURL               = '/app';
    ENV.apiHost               = 'https://api.retirementplan.io/api';
    ENV.ga_tracking_code      = 'UA-49011476-2';
    ENV.ga_domain             = 'retirementplan.io';
    ENV.facebook_app_id       = '234609303319737';
    ENV.google_client_id      = '397821256171-gjvb503eta4573q3affeprdfr9abf8gs.apps.googleusercontent.com';
    ENV.rollbar_client_token  = 'ccfdfb146e8b41e588820021e3a7a572';

  }

  return ENV;
};
