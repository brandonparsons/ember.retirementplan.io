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
        RetirementPlan.setFlash('success', 'Your portfolio selection has been saved.');
        route.transitionTo('user.dashboard');
      });
    }

  },

});
