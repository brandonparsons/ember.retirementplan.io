import Ember from 'ember';
import { request as icAjaxRequest } from 'ic-ajax';

export default Ember.Route.extend({

  beforeModel: function() {
    // To come to the simulation route, must have completed parameters.
    // We will redirect them to the expenses page so that it doesn't
    // automatically accept the default expenses.
    var currentUser = this.controllerFor('user.current');
    if ( !currentUser.get('hasSimulationInput') ) {
      this.transitionTo('retirement_simulation.expenses');
      RetirementPlan.setFlash('error', 'You have not completed all steps required to visit the simulation page.');
    }
  },

  actions: {

    acceptSimulation: function() {
      var route       = this;
      var currentUser = this.controllerFor('user.current').get('model');

      if ( !currentUser.get('hasCompletedSimulation') ) {
        // Notify the server that the user has accepted a simulation.
        icAjaxRequest({
          url: window.RetirementPlanENV.apiHost + '/simulation',
          type: 'POST'
        }).then(function() {
          currentUser.reload().then(function() { // Reload the user to get updated `hasCompletedSimulation`
            route.transitionTo('user.dashboard');
            RetirementPlan.setFlash('success', "You have accepted this portfolio. Now just set up your portfolio and you're all done!");
          });
        });
      } else if ( !currentUser.get('hasTrackedPortfolio') ) {
        route.transitionTo('user.dashboard');
        RetirementPlan.setFlash('success', "Set up your portfolio so we can keep it in balance.");
      } else {
        route.transitionTo('user.dashboard');
        RetirementPlan.setFlash('success', "Remember to let us know if you purchase any additional securities.");
      }
    },

  }

});
