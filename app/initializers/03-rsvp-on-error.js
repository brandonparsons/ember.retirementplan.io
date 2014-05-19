export default {
  name: 'rsvp-on-error',
  initialize: function(container, application) {
    // Grab the router so we can transition to login if 401
    var router = application.__container__.lookup('router:main');

    var defaultErrorMessage = function(error) {
      return error && error.jqXHR && error.jqXHR.responseJSON && error.jqXHR.responseJSON.error;
    };

    var passedErrorMessage = function(error) {
      return error && error.jqXHR && error.jqXHR.responseJSON && error.jqXHR.responseJSON.message;
    };

    var handleError = function(error) {
      var errorMessage;

      if (window.ENV.debug) {
        Ember.warn("Caught Ember.RSVP Error!");
        window.console.log(error);
        window.console.log(error.jqXHR.responseJSON);
      }

      if (error.errorThrown === 'Unauthorized') {
        errorMessage =  defaultErrorMessage(error) || passedErrorMessage(error) || 'Invalid credentials.';
        router.transitionTo('login');
        application.setFlash('error', errorMessage);
      } else {
        application.setFlash('error', "Sorry - something went wrong...");
      }

      // Em.$.ajax('/error-notification', 'POST', {
      //   stack: error.stack,
      //   otherInformation: 'exception message'
      // });
    };

    Ember.RSVP.on('error', function (errorObject) { handleError(errorObject); });
  }
};
