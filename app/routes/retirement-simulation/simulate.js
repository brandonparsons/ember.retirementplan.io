import Ember from 'ember';

export default Ember.Route.extend({

  beforeModel: function() {
    // To come to the simulation route, must have completed parameters.
    // We will redirect them to the expenses page so that it doesn't
    // automatically accept the default expenses.
    var currentUser = this.controllerFor('user.current');
    if ( !currentUser.get('hasRetirementSimulationParameters') ) {
      this.transitionTo('retirement_simulation.expenses');
      RetirementPlan.setFlash('error', 'You have not completed all steps required to visit the simulation page.');
    }
  }

});
