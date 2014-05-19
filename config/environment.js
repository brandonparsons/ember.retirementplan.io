module.exports = function(environment) {
  var ENV = {
    baseURL: '/',
    locationType: 'auto',

    debug: false,

    FEATURES: { // Here you can enable experimental features on an ember canary build e.g. 'with-controller': true
    },

    APP: { // Here you can pass flags/options to your application instance when it is created
      rootElement: '#ember-application'
    }

  };

  if (environment === 'development') {
    // // DEFAULT ENTRIES // //
    ENV.LOG_MODULE_RESOLVER = true; // LOG_MODULE_RESOLVER is needed for pre-1.6.0
    ENV.APP.LOG_RESOLVER = true;
    ENV.APP.LOG_ACTIVE_GENERATION = true;
    ENV.APP.LOG_MODULE_RESOLVER = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    ENV.APP.LOG_VIEW_LOOKUPS = true;
    //                        //

    ENV.apiHost     = 'http://localhost:3000';
    ENV.debug       = true;
  }

  if (environment === 'production') {
    ENV.apiHost     = 'https://api.retirementplan.io';
  }

  // BKP Added:
  ENV.serverLoginEndpoint   = ENV.apiHost + '/users/sign_in';
  ENV.serverLogoutEndpoint  = ENV.apiHost + '/users/sign_out';

  return ENV;
};
