var getCookie = function (name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
};

var extractGAClientIdFromCookie = function() {
  var gaCookieValue = getCookie("_ga");
  var clientIdRegex = /^GA\d\.\d\.(.+)$/;
  var matchData     = gaCookieValue.match(clientIdRegex);
  if (matchData) {
    return matchData[1];
  } else {
    return null;
  }
};

export default function() {
  var clientId;
  if (!window.ga) { return null; }

  window.ga(function(tracker) {
    clientId = tracker.get('clientId');
  });

  if (clientId) {
    return clientId;
  } else {
    return extractGAClientIdFromCookie();
  }
}
