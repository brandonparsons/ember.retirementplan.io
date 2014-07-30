/* global Rollbar */

import Ember from 'ember';

export default {
  name: 'on-error',
  initialize: function(container, application) {

    ///////////

    var postErrorToLoggingService = function(error) {
      var errorMessage  = determineErrorMessage(error, false);
      var sessionData   = container.lookup('controller:application').get('session.content');
      var email         = sessionData.user_email;
      var id            = sessionData.user_id;

      if (Rollbar.notifier === null) { // They have blocked the Rollbar javascript!
        var errorObject = {
          stack: error.stack,
          message: errorMessage
        };
        if (error.jqXHR && error.jqXHR.responseJSON) {
          errorObject.responseJSON = error.jqXHR.responseJSON;
        }
        Ember.$.ajax({
          url: window.RetirementPlanENV.apiHost + '/js_error',
          type: 'POST',
          data: errorObject
        });
      } else { // Rollbar javascript not blocked
        // FIXME: Configuring person data every time there is an error right now.
        // Is there a better way?
        Rollbar.configure({
          payload: {
            person: {
              id: id,
              username: null,
              email: email
            }
          }
        });

        Rollbar.error("[JS Error]: " + errorMessage, error);
      }
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
        var errorMessageValid = true;
        if (value !== null) { // Can come with null values
          if (value instanceof Array) {
            if (value.length === 0) { // No array content - no error
              errorMessageValid = false;
            } else {
              joinedMessage = value.join(', ');
            }
          } else { // Not an array
            joinedMessage = value;
          }

          if (errorMessageValid) { // Only add to the message if is valid
            message += " " + Ember.String.capitalize(key) + ": " + joinedMessage + '.';
          }
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
      var errorMessage  = determineErrorMessage(error, false);
      var sticky        = error && error.jqXHR && error.jqXHR.responseJSON && error.jqXHR.responseJSON.sticky || false;

      if (window.RetirementPlanENV.debug) {
        Ember.warn(errorMessage);
        window.console.log(JSON.stringify(error));
      }

      postErrorToLoggingService(error);

      application.setFlash('error', errorMessage, sticky);
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
