// Spinkit (https://github.com/tobiasahlin/SpinKit) only supports browsers that
// can perform the required anmiations.  Fallback to font-awesome spinner if we
// can't use spinkit.

var browserSupportsCSSProperty = function (propertyName) {
  var elm = document.createElement('div');
  propertyName = propertyName.toLowerCase();

  if (elm.style[propertyName] !== undefined) {
    return true;
  }

  var propertyNameCapital = propertyName.charAt(0).toUpperCase() + propertyName.substr(1),
    domPrefixes = 'Webkit Moz ms O'.split(' ');

  for (var i = 0; i < domPrefixes.length; i++) {
    if (elm.style[domPrefixes[i] + propertyNameCapital] !== undefined) {
      return true;
    }
  }

  return false;
};

export default {
  name: 'animation-support',
  initialize: function(container, application) {
    var spinkitSupported = browserSupportsCSSProperty('animation');
    application.register('compatibility:SPINKIT_SUPPORTED', spinkitSupported, {instantiate: false});
    application.inject('controller', 'spinkitSupported', 'compatibility:SPINKIT_SUPPORTED');
  }
};
