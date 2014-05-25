export default Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin, {

  /* renderTemplate requires customization for `bootstrap-for-ember` tooltips */
  /* and popovers. See: http://ember-addons.github.io/bootstrap-for-ember/#/show_components/popover */
  renderTemplate: function() {
    this.render(); // Render default outlet

    // render extra outlets
    var controller = this.controllerFor('tooltip-box');
    this.render("bs-tooltip-box", {
      outlet: "bs-tooltip-box",
      controller: controller,
      into: "application" // important when using at root level
    });
  },
  /* */


  actions: {

    /* Over-ride the Ember-simple-auth controller action, so that we can do */
    /* things on login (e.g. google analytics user_id). */
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
    /* */

    /* Over-ride the Ember-simple-auth controller action, and set the error */
    /* message here instead of relying on the RSVP.on 'error' call. */
    sessionAuthenticationFailed: function(error) {
      var errorMessage =  this._passedErrorMessage(error)  ||
                          this._serverDefaultErrorMessage(error) ||
                          'Invalid credentials.';
      // this.controllerFor('application').set('loginErrorMessage', error.message);
      RetirementPlan.setFlash('error', errorMessage);
    }
    /* */

  },


  /* Private methods */
  _passedErrorMessage: function(error) {
    if (error && error.jqXHR && error.jqXHR.responseJSON && error.jqXHR.responseJSON.message) {
      return error.jqXHR.responseJSON.message;
    } else if (error && error.message) {
      return error.message;
    } else {
      return false;
    }
  },

  _serverDefaultErrorMessage: function(error) {
    return error && error.jqXHR && error.jqXHR.responseJSON && error.jqXHR.responseJSON.error;
  }
  /* */

});
