import Ember from 'ember';

export default Ember.ObjectController.extend({

  needs: ['application', 'user/current', 'retirementSimulation/simulate'],
  currentUser:      Ember.computed.alias('controllers.user/current'),
  displayingChart:  Ember.computed.alias('controllers.retirementSimulation/simulate.haveChartToDisplay'),

  hasSimulationInput:    Ember.computed.alias('currentUser.hasSimulationInput'),
  hasNoSimulationInput:  Ember.computed.not('hasSimulationInput'),

  currentRouteName:     Ember.computed.alias('controllers.application.currentRouteName'),
  isOnExpensesRoute:    Ember.computed.equal('currentRouteName', 'retirement_simulation.expenses'),
  isOnParametersRoute:  Ember.computed.equal('currentRouteName', 'retirement_simulation.parameters'),
  isOnSimulateRoute:    Ember.computed.equal('currentRouteName', 'retirement_simulation.simulate'),

  // Whether or not the left-chevron arrow in the nav tabs is disabled
  previousDisabled: Ember.computed.or('isOnExpensesRoute'),

  // Whether or not the right-chevron arrow in the nav tabs is disabled
  shouldBeBlockedFromLeavingParameters: Ember.computed.and('isOnParametersRoute', 'hasNoSimulationInput'),
  notDisplayingChart:                   Ember.computed.not('displayingChart'),
  shouldBeBlockedFromLeavingSimulate:   Ember.computed.and('isOnSimulateRoute', 'notDisplayingChart'),
  nextDisabled:                         Ember.computed.or('shouldBeBlockedFromLeavingParameters', 'shouldBeBlockedFromLeavingSimulate'),


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
        if (window.confirm("Accept this portfolio/simulation? You have additional options at the bottom of this screen.")) {
          this.send('acceptSimulation');
        } else {
          // no-op
        }
      } else { // Should not get here
        throw new Error('Invalid route name');
      }
    },

  } // actions

});
