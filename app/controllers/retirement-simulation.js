import Ember from 'ember';

export default Ember.ObjectController.extend({

  hasSimulationInput:    Ember.computed.alias('currentUser.hasSimulationInput'),
  hasNoSimulationInput:  Ember.computed.not('hasSimulationInput'),

  needs: ['application'],
  currentRouteName:     Ember.computed.alias('controllers.application.currentRouteName'),
  isOnExpensesRoute:    Ember.computed.equal('currentRouteName', 'retirement_simulation.expenses'),
  isOnParametersRoute:  Ember.computed.equal('currentRouteName', 'retirement_simulation.parameters'),
  isOnSimulateRoute:    Ember.computed.equal('currentRouteName', 'retirement_simulation.simulate'),

  // Whether or not the left-chevron arrow in the nav tabs is disabled
  previousDisabled: Ember.computed.or('isOnExpensesRoute'),

  // Whether or not the right-chevron arrow in the nav tabs is disabled
  shouldBeBlockedFromLeavingParameters: Ember.computed.and('isOnParametersRoute', 'hasNoSimulationInput'),
  nextDisabled: Ember.computed.or('isOnSimulateRoute', 'shouldBeBlockedFromLeavingParameters'),


  // These actions could go on the route, but you are already getting & checking
  // the current route name on the controller to determine if the arrows should
  // be disabled or not.
  actions: {

    // Via click on left-chevron arrow in nav-tabs
    goPrevious: function() {
      if ( this.get('isOnExpensesRoute') ) {
        return null;
      } else if ( this.get('isOnParametersRoute') ) {
        this.transitionToRoute('retirement_simulation.expenses');
      } else if ( this.get('isOnSimulateRoute') ) {
        this.transitionToRoute('retirement_simulation.parameters');
      } else { // Should not get here
        throw new Error('Invalid route name');
      }
    },

    // Via click on right-chevron arrow in nav-tabs
    goNext: function() {
      if ( this.get('isOnExpensesRoute') ) {
        this.transitionToRoute('retirement_simulation.parameters');
      } else if ( this.get('isOnParametersRoute') ) {
        this.transitionToRoute('retirement_simulation.simulate');
      } else if ( this.get('isOnSimulateRoute') ) {
        return null;
      } else { // Should not get here
        throw new Error('Invalid route name');
      }
    }

  }

});
