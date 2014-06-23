import Ember from 'ember';
import Portfolio from 'retirement-plan/models/portfolio';
import { request as icAjaxRequest } from 'ic-ajax';

export default Ember.Route.extend({

  // Need to set the model to an empty array on boot, otherwise ember appears
  // to fill it with the securities (from the parent route, not what we want.)
  model: function() { return []; },

  activate: function() {
    // Workaround to ensure that the observers all fire on route load - we
    // aren't "get-ing" the property in the template
    this.controllerFor('select_portfolio.chart').ensureGraphRendered();
  },

  actions: {

    saveSelectedPortfolio: function(portfolioID) {
      var route = this;
      icAjaxRequest({
        url:  window.RetirementPlanENV.apiHost + '/portfolio',
        type: 'POST',
        data: { allocation: Portfolio.allocationFromID(portfolioID) }
      }).then( function() {
        var currentUser = route.controllerFor('user.current').get('model');
        if (!currentUser.get('hasSelectedPortfolio')) {
          // This is their first time selecting. Update the user model.
          currentUser.reload();
          RetirementPlan.setFlash('success', 'Your portfolio selection has been saved. Next up - set up your retirement expenses!');
        } else {
          RetirementPlan.setFlash('success', 'Your portfolio selection has been saved.');
        }
        route.transitionTo('user.dashboard');
      });
    }

  },

});
