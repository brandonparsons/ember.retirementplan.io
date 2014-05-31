export default Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin, {

  /* renderTemplate requires customization for `bootstrap-for-ember` tooltips */
  /* and popovers. See: http://ember-addons.github.io/bootstrap-for-ember/#/show_components/popover */
  renderTemplate: function() {
    this.render(); // Render default outlet

    // Fender extra outlets
    var controller = this.controllerFor('tooltip-box');
    this.render("bs-tooltip-box", {
      outlet: "bs-tooltip-box",
      controller: controller,
      into: "application"
    });
  },
  /* */


  beforeModel: function(transition) {
    // If we are booting up the app already with session info (they reloaded the
    // page while logged in), set the current user controller content to the user.
    var userID = this.get('session.user_id');
    // Need to send action to transition in a beforeModel (first route)
    if (userID) { transition.send('setupCurrentUserController', userID); }
  },


  actions: {

    setupCurrentUserController: function(userID) {
      var currentUserController;

      currentUserController = this.controllerFor('currentUser');
      this.store.find('user', userID).then( function(user) {
        currentUserController.set('content', user);
      });
    },

    /* Over-ride the Ember-simple-auth controller action */
    sessionAuthenticationSucceeded: function() {
      // Set up the current user controller with the user ID we just received
      var userID = this.get('session.user_id');
      this.send('setupCurrentUserController', userID);

      // Everything below here is essentially a copy of the original
      // ember-simple-auth behaviour.

      var attemptedTransition = this.get('session.attemptedTransition');
      if (attemptedTransition) {
        // Retry the failed route transition
        attemptedTransition.retry();
        this.set('session.attemptedTransition', null);
      } else {
        // There was no failed transition - send to dashboard. This would otherwise
        // be the `routeAfterAuthentication` in the simple-auth initializer
        this.transitionTo('dashboard');
      }
    }
    /* */

  }

});
