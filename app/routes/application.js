export default Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin, {

  renderTemplate: function() {
    // Need to render a custom template/outlet for `bootstrap-for-ember` tooltips
    // and popovers. See:
    //http://ember-addons.github.io/bootstrap-for-ember/#/show_components/popover

    // Render default outlet
    this.render();

    // Render extra outlets
    var controller = this.controllerFor('tooltip-box');
    this.render("bs-tooltip-box", {
      outlet: "bs-tooltip-box",
      controller: controller,
      into: "application"
    });
  },

  beforeModel: function() {
    // If we are booting up the app already with session info (they reloaded
    // the page while logged in), set the current user controller content to
    // the user.
    var userID  = this.get('session.user_id');
    if (userID) {
      return this._setCurrentUserContent(userID);
    } else {
      return null;
    }
  },

  _setCurrentUserContent: function(userID) {
    // This must return a promise so that beforeModel will wait for it to
    // resolve before continuing to render the application and leaf routes.
    var store                 = this.store;
    var currentUserController = this.controllerFor('user.current');

    return new Ember.RSVP.Promise(function(resolve) {
      store.find('user', userID).then( function(user) {
        currentUserController.set('content', user);
        resolve(null);
      });
    });
  },

  actions: {

    error: function(error) {
      // See: https://speakerdeck.com/elucid/ember-errors-and-you
      // This will not be required in Ember 1.7
      Ember.onerror(error);
      return true;
    },

    /* Bubble from various locations */
    transitionToSignUp: function() {
      this.transitionTo('sign_up');
    },

    transitionToSignIn: function() {
      this.transitionTo('sign_in');
    },

    cancel: function() {
      this.transitionTo('user.dashboard');
    },
    /* */

    sessionAuthenticationSucceeded: function() {
      // Over-ride the Ember-simple-auth controller action

      // Set up the current user controller with the user ID we just received
      var route   = this;
      var session = route.get('session');
      var userID  = session.get('user_id');
      var email   = session.get('user_email');

      this._setCurrentUserContent(userID).then(function() {
        RetirementPlan.setFlash('success', 'Welcome! Signed in as ' + email + '.');

        /*
        Everything below here is essentially a copy of the original
        ember-simple-auth behaviour.
        */

        var attemptedTransition = route.get('session.attemptedTransition');
        if (attemptedTransition) {
          // Retry the failed route transition
          attemptedTransition.retry();
          route.set('session.attemptedTransition', null);
        } else {
          // There was no failed transition - send to dashboard. This would otherwise
          // be the `routeAfterAuthentication` in the simple-auth initializer
          route.transitionTo('user.dashboard');
        }
      });
    },

  } // actions

});
