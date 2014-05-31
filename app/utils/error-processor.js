var errorProcessor = function (errorJSON) {
  if (errorJSON) {
    var errors  = errorJSON.jqXHR.responseJSON;
    var message = "There was a problem with your request.";

    _.forOwn(errors, function(value, key) {
      if (value !== null) { // Can come with null values
        message += " " + Ember.String.capitalize(key) + " " + value.join(',') + '.';
      }
    });

    return Ember.$.trim(message);
  } else {
    return null;
  }
};

export default errorProcessor;
