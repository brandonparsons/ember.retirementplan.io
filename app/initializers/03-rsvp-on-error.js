export default {
  name: 'rsvp-on-error',
  initialize: function(container, application) {

    Ember.RSVP.on('error', function (error) {
      var errorMessage;

      if (window.ENV.debug) {
        Ember.warn("Caught Ember.RSVP Error!");
        window.console.log(error);
        window.console.log(error.jqXHR.responseJSON);
      }

      // Handle all non-401 errors. Ember-simple-auth hooks handle the 401's
      if (error.errorThrown !== 'Unauthorized' && error.jqXHR.status !== 401) {
        errorMessage = _passedErrorMessage(error) || _defaultErrorMessage(error) || 'Sorry - something went wrong.';
        application.setFlash('error', errorMessage);

        // / If you turn this on, consider doing the same in the 'error' route/view
        // / Note that you were having troubles getting stuff in the 'error' route
        // / to execute.
        // Em.$.ajax('/somewhere/error-notification', 'POST', {
        //   stack: error.stack,
        //   otherInformation: 'exception message'
        // });
      }

    });

    //////

    // Utility methods:

    // Will be hoisted above Ember.RSVP.on ....
    var _passedErrorMessage = function(error) {
      return error && error.jqXHR && error.jqXHR.responseJSON && error.jqXHR.responseJSON.message;
    };

    // Will be hoisted above Ember.RSVP.on ....
    var _defaultErrorMessage = function(error) {
      return error && error.jqXHR && error.jqXHR.responseJSON && error.jqXHR.responseJSON.error;
    };

  }
};
