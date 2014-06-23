import Ember from 'ember';
import { request as icAjaxRequest } from 'ic-ajax';

export default Ember.Route.extend({

  beforeModel: function() {
    // If they have come to this route, they are implicitly accepting the default
    // expenses we created for them if they did not update them.
    var currentUser = this.controllerFor('user.current').get('model');
    if ( !currentUser.get('hasSelectedExpenses') ) {
      icAjaxRequest({
        url:  window.RetirementPlanENV.apiHost + '/expenses/confirm',
        type: 'POST'
      }).then(function() {
        // This will have updated the `hasSelectedExpenses` value on the user.
        // Tell the model to update itself.  Previously returned user JSON from
        // this route, but too brittle as they are completely unrelated.
        currentUser.reload();
      });
    }
  },

  model: function() {
    var simulationInput = this.controllerFor('user.current').get('simulationInput');
    if (Ember.isEmpty(simulationInput)) {
      return this.store.createRecord('simulationInput');
    } else {
      return simulationInput;
    }
  },

  actions: {
    saveInputs: function() {
      var route = this;
      var simulationInput = this.modelFor(this.routeName);
      simulationInput.save().then( function() {
        var currentUser = route.controllerFor('user.current').get('model');
        if (!currentUser.get('hasSimulationInput')) {
          // This is their first time submitting. Update the user model.
          currentUser.reload();
          route.transitionTo('retirement_simulation.simulate');
          RetirementPlan.setFlash('success', 'Your simulation parameters have been saved. Time to run your retirement simulations.');
        } else {
          route.transitionTo('user.dashboard');
          RetirementPlan.setFlash('success', 'Your responses have been saved. If you have made significant changes you may want to re-run your simulations.');
        }
      });
    }
  }

});
