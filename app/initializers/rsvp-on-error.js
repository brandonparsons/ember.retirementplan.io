export default {
  name:   'rsvp-on-error',
  after:  'flash-functions',
  initialize: function(container, application) {

    Ember.RSVP.on('error', function (error) {
      var errorMessage, session, sticky;

      if (window.ENV.debug) {
        Ember.warn("Caught Ember.RSVP Error!");
        window.console.log(error);
        window.console.log(error.jqXHR.responseJSON);
        window.console.log(error.stack);
      }

      // / If you turn this on, consider doing the same in the 'error' route/view
      // / Note that you were having troubles getting stuff in the 'error' route
      // / to execute.
      // Em.$.ajax('/somewhere/error-notification', 'POST', {
      //   stack: error.stack,
      //   responseJSON: error.jqXHR.responseJSON,
      //   message: errorMessage
      // });

      // If it was a 401 error, clear the session and 'reboot'. Otherwise, determine
      // the error message and display it.
      if (error.errorThrown === 'Unauthorized' || error.jqXHR.status === 401) {

        session = application.__container__.lookup('controller:application').get('session');
        session.clear();
        window.location.replace(window.ENV.baseURL);

      } else {

        if (error && error.jqXHR && error.jqXHR.responseJSON && error.jqXHR.responseJSON.message) {
          errorMessage = error.jqXHR.responseJSON.message;
        } else if (error && error.message) {
          errorMessage = error.message;
        } else if (error && error.jqXHR && error.jqXHR.responseJSON && error.jqXHR.responseJSON.error) {
          errorMessage = error && error.jqXHR && error.jqXHR.responseJSON && error.jqXHR.responseJSON.error;
        } else {
          errorMessage = 'Sorry - something went wrong.';
        }

        sticky = error && error.jqXHR && error.jqXHR.responseJSON && error.jqXHR.responseJSON.sticky || false;

        application.setFlash('error', errorMessage, sticky);

      }

    }); // RSVP.onError

  } // initialize
};
