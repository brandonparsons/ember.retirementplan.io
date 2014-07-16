import Ember from 'ember';

export default Ember.Route.extend(
  Ember.SimpleAuth.ApplicationRouteMixin, {


  ///////////
  // Hooks //
  ///////////

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


  /////////////////////////
  // 'Private' Functions //
  /////////////////////////

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


  /////////////
  // Actions //
  /////////////

  actions: {

    error: function(error) {
      // See: https://speakerdeck.com/elucid/ember-errors-and-you
      // This will not be required in Ember 1.7
      Ember.onerror(error);
      return true;
    },

    transitionToSignUp: function() {
      this.transitionTo('sign_up');
    },

    transitionToSignIn: function() {
      this.transitionTo('sign_in');
    },

    cancel: function() {
      this.transitionTo('user.dashboard');
    },

    // Render the template named "genericModal" into an outlet named "modal"
    // located in the "application" template.
    // You can implement this in other routes, with other templates to achieve
    // shared modals without having to embed in a page's template
    // @param: `templateLocation` e.g. 'shared/genericModal'
    // @param: `controller` e.g. expense
    showSharedModal: function(templateLocation, controller) {
      var options = { into: 'application', outlet: 'modal' };
      if (controller && typeof(controller) !== 'undefined') {
        options.controller = controller;
      }
      this.render(templateLocation, options);
    },

    // This is "undo" for the showRenderedModal action implemented above, and in
    // other routes. This may be "overriden" in each route as appropriate.
    destroyModal: function() {
      this.disconnectOutlet({
        outlet:     'modal',
        parentView: 'application'
      });
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

    actionBasedTransitionTo: function(route) {
      // Check if it should be enabled at this point (user progress) prior to
      // transitioning.
      // Keep this in the application route otherwise it does odd things....
      var doTransition;

      if (route === 'questionnaire') {
        doTransition = this.controllerFor('user.dashboard').get('questionnaireEnabled');
      } else if (route === 'select_portfolio') {
        doTransition = this.controllerFor('user.dashboard').get('portfolioSelectionEnabled');
      } else if ( route.match(/retirement_simulation\..*/i) ) {
        doTransition = this.controllerFor('user.dashboard').get('retirementSimulationEnabled');
      } else if ( route.match(/tracked_portfolio\..*/i) ) {
        doTransition = this.controllerFor('user.dashboard').get('trackPortfolioEnabled');
      } else {
        throw new Error('Invalid route name'); // Shouldn't get here unless you add additional buttons
      }

      if (doTransition) {
        this.transitionTo(route);
      }
    }

  },

});
