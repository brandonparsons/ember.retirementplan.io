export default {
  name:   'on-error',
  after:  'flash-functions',
  initialize: function(container, application) {

    Ember.onerror = function(error) {
      if (window.ENV.debug) {
        Ember.warn("Caught Ember.RSVP Error!");
        window.console.log(error);
        window.console.log(error.jqXHR.responseJSON);
        window.console.log(error.stack);
      }

      // Em.$.ajax('/somewhere/error-notification', 'POST', {
      //   stack: error.stack,
      //   responseJSON: error.jqXHR.responseJSON,
      //   message: errorMessage
      // });
    }

    Ember.RSVP.on('error', function (error) {
      var errorMessage, sticky;
      var session = container.lookup('controller:application').get('session');
      var router  = container.lookup('router:main');

      if (window.ENV.debug) {
        Ember.warn("Caught Ember.RSVP Error!");
        window.console.log(error);
        window.console.log(error.jqXHR.responseJSON);
        window.console.log(error.stack);
      }

      // Em.$.ajax('/somewhere/error-notification', 'POST', {
      //   stack: error.stack,
      //   responseJSON: error.jqXHR.responseJSON,
      //   message: errorMessage
      // });

      var _determineErrorMessage = function(error) {
        if (error && error.jqXHR && error.jqXHR.responseJSON && error.jqXHR.responseJSON.message) {
          return error.jqXHR.responseJSON.message;
        } else if (error && error.message) {
          return error.message;
        } else if (error && error.jqXHR && error.jqXHR.responseJSON && error.jqXHR.responseJSON.error) {
          return error && error.jqXHR && error.jqXHR.responseJSON && error.jqXHR.responseJSON.error;
        } else {
          return 'Sorry - something went wrong.';
        }
      };


      if (error.errorThrown === 'Unauthorized' || error.jqXHR.status === 401) {
        // If it was a 401 error, clear the session and 'reboot'
        session.clear();
        window.location.replace(window.ENV.baseURL);

      } else if (error.errorThrown === 'Forbidden' || error.jqXHR.status === 403) {
        // If it is a 403, display the message and redirect to an appropriate page
        errorMessage  = _determineErrorMessage(error);

        if (error.jqXHR.responseJSON.reason === 'email_confirmation') {
          session.clear();
          router.transitionTo('email_confirmation');
        } else {
          //
        }
        application.setFlash('error', errorMessage, 10000);
      } else {
        // Not any of the errors above. Just grab the error message and process it.
        errorMessage  = _determineErrorMessage(error);
        sticky        = error && error.jqXHR && error.jqXHR.responseJSON && error.jqXHR.responseJSON.sticky || false;
        application.setFlash('error', errorMessage, sticky);
      }

    }); // RSVP.onError

  } // initialize
};
