import Ember from 'ember';

export default Ember.Route.extend({

  actions: {
    actionBasedTransitionTo: function(route) {
      // Check if it should be enabled at this point (user progress) prior to
      // transitioning.
      var doTransition;

      if (route === 'questionnaire') {
        doTransition = this.get('controller.questionnaireEnabled');
      } else if (route === 'select_portfolio') {
        doTransition = this.get('controller.portfolioSelectionEnabled');
      } else if ( route.match(/retirement_simulation\..*/i) ) {
        doTransition = this.get('controller.retirementSimulationEnabled');
      } else if ( route.match(/tracked_portfolio\..*/i) ) {
        doTransition = this.get('controller.trackPortfolioEnabled');
      } else {
        throw new Error('Invalid route name'); // Shouldn't get here unless you add additional buttons
      }

      if (doTransition) {
        this.transitionTo(route);
      }
    }
  }

});
