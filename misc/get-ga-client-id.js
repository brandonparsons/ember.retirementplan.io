var getCookie = function (name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length === 2) {
    return parts.pop().split(";").shift();
  }
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

  if (window.ga) {
	  window.ga(function(tracker) {
	    clientId = tracker.get('clientId');
	  });
  }

  // Because the marketing site (www..../) and this ember app (www..../app/...)
  // live on the same domain (www), we can check if there is a cookie set by the
  // marketing site.  This won't work if you pull the ember app onto a separate
  // domain.
  if (clientId) {
    return clientId;
  } else {
    return extractGAClientIdFromCookie();
  }
}
