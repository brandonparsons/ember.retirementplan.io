export default function() {
  var clientId;
  if (!window.ga) { return null; }

  window.ga(function(tracker) {
    clientId = tracker.get('clientId');
  });

  return clientId;
}
