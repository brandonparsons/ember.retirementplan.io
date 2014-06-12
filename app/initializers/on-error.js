export default {
  name:   'on-error',
  after:  'flash-functions',
  initialize: function(container, application) {

    var determineErrorMessage = function(error) {
      if (!error) return 'Sorry - something went wrong.';

      if (error.jqXHR && error.jqXHR.responseJSON && error.jqXHR.responseJSON.message) {
        return error.jqXHR.responseJSON.message;
      } else if (error.message) {
        return error.message;
      } else if (error.jqXHR && error.jqXHR.responseJSON && error.jqXHR.responseJSON.error) {
        return error.jqXHR && error.jqXHR.responseJSON && error.jqXHR.responseJSON.error;
      } else {
        return 'Sorry - something went wrong.';
      }
    };

    var handleGenericError = function(error) {
      // Just grab the error message and display it.
      var errorMessage  = determineErrorMessage(error);
      var sticky        = error && error.jqXHR && error.jqXHR.responseJSON && error.jqXHR.responseJSON.sticky || false;
      application.setFlash('error', errorMessage, sticky);
    };

    var clearSession = function() {
      try {
        var session = container.lookup('controller:application').get('session');
        session.clear();
      } catch (e) {
        window.localStorage.clear();
      }
    };

    var handleUnauthorizedError = function() {
      // If it was a 401 error, clear the session and 'reboot'
      clearSession();
      window.location.replace(window.ENV.baseURL);
    };

    var transitionTo = function (route) {
      var router  = container.lookup('router:main');
      router.transitionTo(route);
    };

    var handleForbiddenError = function(error) {
      // If it is a 403, display the message and redirect to an appropriate page
      var reason;
      var errorMessage = determineErrorMessage(error);

      // Rails will sometimes provide instructions on what route to redirect to
      if (error.jqXHR && error.jqXHR.responseJSON && error.jqXHR.responseJSON.reason) {
        reason = error.jqXHR.responseJSON.reason;

        if (reason === 'email_confirmation') {
          clearSession();
          transitionTo('email_confirmation');
         } else if (reason === 'terms') {
          transitionTo('terms');
        } else {
          // No- op
        }
      }

      application.setFlash('error', errorMessage, 10000);
    };

    var postErrorToLoggingService = function(error) {
      if (window.ENV.debug) {
        Ember.warn("Have not set up logging service.");
        return error;
      }
      // FIXME: Need to post to airbrake service
      // Em.$.ajax('/somewhere/error-notification', 'POST', {
      //   stack: error.stack,
      //   responseJSON: error.jqXHR.responseJSON,
      //   message: errorMessage
      // });
    };

    Ember.onerror = function(error) {
      if (!error) return;

      if (window.ENV.debug) {
        Ember.warn("Caught Error!");
        if (error.jqXHR && error.jqXHR.responseJSON) Ember.warn(JSON.stringify(error.jqXHR.responseJSON));
        Ember.warn(JSON.stringify(error));
        if (error.stack) Ember.warn(JSON.stringify(error.stack));
      }

      postErrorToLoggingService(error);

      if (error.errorThrown) {
        if (error.errorThrown === 'Unauthorized' || error.jqXHR.status === 401) {
          handleUnauthorizedError(error);
        } else if (error.errorThrown === 'Forbidden' || error.jqXHR.status === 403) {
          handleForbiddenError(error);
        } else {
          handleGenericError(error);
        }
      } else {
        handleGenericError(error);
      }
    }; // onerror

    Ember.RSVP.on('error', function(error) {
      Ember.onerror(error);
    });

  } // initialize
};
