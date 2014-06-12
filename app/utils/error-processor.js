import Ember from 'ember';

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

var errorProcessor = function (errorJSON) {
  if (errorJSON) {
    var message;
    var errors = errorJSON.jqXHR.responseJSON;

    if ( isCustomRailsErrorMessage(errors) ) {
      message = errors.message;
    } else {
      // We have received an errors object from Rails. Parse and put together
      // a single view for the client.
      message = "There was a problem with your request.";

      _.forOwn(errors, function(value, key) {
        if (value !== null) { // Can come with null values
          message += " " + Ember.String.capitalize(key) + " " + value.join(',') + '.';
        }
      });
    }
    return Ember.$.trim(message);
  } else {
    return null;
  }
};

export default errorProcessor;
