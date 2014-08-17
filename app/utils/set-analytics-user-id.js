/* global ga */

export default function(userID) {
  // Set the google analytics user id now that we have it. Supposedly can do this... see:
  // http://stackoverflow.com/questions/23379338/set-google-analytics-user-id-after-creating-the-tracker
  if (window.RetirementPlanENV.debug) {
    Ember.debug("Logged in - setting Google Analytics userID to " + userID);
  }
  if ( typeof(ga) !== 'undefined' && ga !== null ) {
    ga('set', '&uid', userID);
  } else {
    Ember.warn("ga (google analyics) not present on window");
  }
};
