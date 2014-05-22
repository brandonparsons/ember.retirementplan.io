module.exports = function(environment) {
  var ENV = {
    baseURL: '/',
    locationType: 'auto',

    debug: false,

    FEATURES: {
      // Here you can enable experimental features on an ember canary build
      // e.g. 'with-controller': true
    },

    APP: {
      // Here you can pass flags/options to your application instance when it
      // is created
      rootElement: '#ember-application'
    }
  };

  if (environment === 'development') {
    ENV.LOG_MODULE_RESOLVER = true; // LOG_MODULE_RESOLVER is needed for pre-1.6.0
    ENV.APP.LOG_RESOLVER = true;
    ENV.APP.LOG_ACTIVE_GENERATION = true;
    ENV.APP.LOG_MODULE_RESOLVER = true;
    ENV.APP.LOG_VIEW_LOOKUPS = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;


    /* BKP-Added */
    ENV.LOG_EVENT_TRACKING    = true;
    ENV.debug                 = true;
    ENV.apiHost               = 'http://localhost:3000';
    ENV.ga_tracking_code      = 'UA-XXX-DEVELOPMENT';
    ENV.ga_domain             = 'retirementplan.io';
    ENV.facebook_app_id       = '649704131751768';
    ENV.google_client_apiKey  = 'AIzaSyDcNEYEnwSJc7mrfiU3d_yLvUhZbBpCE8E';
    ENV.google_client_id      = '473904766177-cataubhq5mhaqadd9j3gjil8i02omft3.apps.googleusercontent.com';
    /* */
  }

  if (environment === 'production') {
    /* BKP-Added */
    ENV.apiHost               = 'https://api.retirementplan.io';
    ENV.ga_tracking_code      = 'UA-49011476-2';
    ENV.ga_domain             = 'retirementplan.io';
    ENV.facebook_app_id       = '234609303319737';
    ENV.google_client_apiKey  = 'AIzaSyCMBIk3_UFIfcfI0hVjWaU2rh5L_phrzwU';
    ENV.google_client_id      = '397821256171-gjvb503eta4573q3affeprdfr9abf8gs.apps.googleusercontent.com'
    /* */
  }

  return ENV;
};
