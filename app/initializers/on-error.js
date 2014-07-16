import Ember from 'ember';

export default {
  name: 'on-error',
  initialize: function(container, application) {

    ///////////

    var postErrorToLoggingService = function(error) {
      var errorMessage  = determineErrorMessage(error, false);
      Ember.warn("Reporting error to API endpoint.");
      Ember.$.ajax(window.RetirementPlanENV.apiHost + '/js_error', 'POST', {
        stack: error.stack,
        responseJSON: error.jqXHR.responseJSON,
        message: errorMessage
      });
    };

    ///////////

    var transitionTo = function (route) {
      var router  = container.lookup('router:main');
      router.transitionTo(route);
    };

    var clearSession = function() {
      try {
        var session = container.lookup('controller:application').get('session');
        session.clear();
      } catch (e) {
        window.localStorage.clear();
      }
    };

    ///////////

    var isCustomRailsErrorMessage = function(errors) {
      // When you are returning a custom error message from rails - e.g.
      // {"success":false,"message":"Current password is incorrect."}
      var errorKeys = _.keys(errors);
      if ( _.include(errorKeys, 'message') && _.include(errorKeys, 'success') && !errors.success ) {
        return true;
      } else {
        return false;
      }
    };

    var buildMessageFromErrorKeys = function(errors) {
      // We have received an errors object from Rails. Parse and put together
      // a single view for the client.
      var message = "There was a problem with your request.";
      _.forOwn(errors, function(value, key) {
        var joinedMessage;
        if (value !== null) { // Can come with null values
          if (value instanceof Array) {
            joinedMessage = value.join(',');
          } else {
            joinedMessage = value;
          }
          message += " " + Ember.String.capitalize(key) + ": " + joinedMessage + '.';
        }
      });
      return message;
    };

    var determineErrorMessage = function(error, isUnprocessableEntityError) {
      if (!error) { return 'Sorry - something went wrong.'; }
      var extractedErrors, errorMessage;

      if (error.jqXHR && error.jqXHR.responseJSON) {
        // We have responseJSON to work with
        extractedErrors = error.jqXHR.responseJSON;

        if (isCustomRailsErrorMessage(extractedErrors)) {
          // In a number of errors (not just 422's), we return a custom error msg
          // from the API: {success: (true|false), message: "ABCD"}. Catch here.
          errorMessage = extractedErrors.message;
        } else if (isUnprocessableEntityError) {
          // It's not a custom error message, but it is a 422. Likely doing a
          // render json: model.errors, status: 422. Build the error message
          // from the response keys.
          errorMessage = buildMessageFromErrorKeys(extractedErrors);
        } else if (extractedErrors.error) {
          errorMessage = extractedErrors.error;
        } else {
          errorMessage = 'Sorry - something went wrong.';
        }

      } else if (error.message) {
        // We don't have responseJSON, but we have error.message
        errorMessage = error.message;
      } else {
        // We don't have anything (responseJSON or error). Try building an error
        // message from it.
        errorMessage = buildMessageFromErrorKeys(error);
      }

      return Ember.$.trim(errorMessage);
    };

    ///////////

    var handleGenericError = function(error) {
      // This was showing generic ember errors as a error flash - dont do that for now.
      var errorMessage  = determineErrorMessage(error, false);
      Ember.warn(errorMessage);
      window.console.log(error.stack);
      window.console.log(JSON.stringify(error));
      // var sticky        = error && error.jqXHR && error.jqXHR.responseJSON && error.jqXHR.responseJSON.sticky || false;
      // application.setFlash('error', errorMessage, sticky);
    };

    var handleUnauthorizedError = function() {
      // If it was a 401 error, clear the session and 'reboot'
      clearSession();
      window.location.replace(window.RetirementPlanENV.baseURL);
    };

    var handleUnprocessableEntityError = function(error) {
      var errorMessage = determineErrorMessage(error, true);
      application.setFlash('error', errorMessage);
    };

    var handleForbiddenError = function(error) {
      // If it is a 403, display the message and redirect to an appropriate page
      var reason;
      var errorMessage = determineErrorMessage(error, false);

      // Rails will sometimes provide instructions on what route to redirect to
      if (error.jqXHR && error.jqXHR.responseJSON && error.jqXHR.responseJSON.reason) {
        reason = error.jqXHR.responseJSON.reason;

        if (reason === 'email_confirmation') {
          clearSession();
          transitionTo('email_confirmation');
        } else if (reason === 'terms') {
          transitionTo('accept_terms');
        } else if (reason === 'questionnaire') {
          transitionTo('questionnaire');
        } else if (reason === 'portfolio') {
          transitionTo('select_portfolio');
        } else if (reason === 'expenses') {
          transitionTo('retirement_simulation.expenses');
        } else if (reason === 'sim_input') {
          transitionTo('retirement_simulation.parameters');
        } else if (reason === 'simulation') {
          transitionTo('retirement_simulation.simulate');
        } else {
          // No- op
        }
      }

      application.setFlash('error', errorMessage, 10000);
    };

    ///////////

    Ember.onerror = function(error) {
      if (!error) { return; }

      if (window.RetirementPlanENV.debug) {
        Ember.warn("Caught Error!");
        if (error.jqXHR && error.jqXHR.responseJSON) {
          console.log(error.jqXHR.responseJSON);
        }
        if (error.stack) {
          console.log(error.stack);
        }
        Ember.warn(JSON.stringify(error));
      }

      postErrorToLoggingService(error);

      if (error.errorThrown) {
        if (error.errorThrown === 'Unauthorized' || error.jqXHR.status === 401) {
          handleUnauthorizedError(error);
        } else if (error.errorThrown === 'Forbidden' || error.jqXHR.status === 403) {
          handleForbiddenError(error);
        } else if (error.jqXHR.status === 422) {
          handleUnprocessableEntityError(error);
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
