/* global RetirementPlan */

export default Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin, {

  actions: {

    // Over-ride the Ember-simple-auth controller action, so that we can do
    // things on login (e.g. google analytics user_id).
    sessionAuthenticationSucceeded: function() {

      // Set the google analytics user id now that we have it. Supposedly can
      // do this... see:
      // http://stackoverflow.com/questions/23379338/set-google-analytics-user-id-after-creating-the-tracker
      window.ga('set', '&uid', this.get('session.user_id'));

      // Everything below here is essentially a copy of the original
      // ember-simple-auth behaviour.

      var attemptedTransition = this.get('session.attemptedTransition');
      if (attemptedTransition) {
        // Retry the failed route transition
        attemptedTransition.retry();
        this.set('session.attemptedTransition', null);
      } else {
        // There was no failed transition - send to dashboard. This is the
        // `routeAfterAuthentication`
        this.transitionTo('dashboard');
      }
    },

    // Over-ride the Ember-simple-auth controller action, and set the error
    // message here instead of relying on the RSVP.on 'error' call.
    sessionAuthenticationFailed: function(error) {
      var errorMessage = this._passedErrorMessage(error) || this._defaultErrorMessage(error) || 'Invalid credentials.';
      RetirementPlan.setFlash('error', errorMessage);
      // this.controllerFor('application').set('loginErrorMessage', error.message);
    }

  },


  // Private methods

  _passedErrorMessage: function(error) {
    return error && error.jqXHR && error.jqXHR.responseJSON && error.jqXHR.responseJSON.message;
  },

  _defaultErrorMessage: function(error) {
    return error && error.jqXHR && error.jqXHR.responseJSON && error.jqXHR.responseJSON.error;
  }

});
