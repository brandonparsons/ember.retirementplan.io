import Ember from 'ember';
import FrontierPortfolio from 'retirement-plan/models/frontier-portfolio';
import { request as icAjaxRequest } from 'ic-ajax';

export default Ember.Route.extend({

  // Need to set the model to an empty array on boot, otherwise ember appears
  // to fill it with the assets (from the parent route, not what we want.)
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
        url:  window.RetirementPlanENV.apiHost + '/portfolios',
        type: 'POST',
        data: { allocation: FrontierPortfolio.allocationFromID(portfolioID) }
      }).then( function() {
        var currentUser = route.controllerFor('user.current');
        // Always reload the current user, so that its portfolio_id gets updated if changed portfolio
        currentUser.get('model').reload().then(function() {
          var firstSelectedPortfolio  = !currentUser.get('hasSelectedPortfolio');
          if (firstSelectedPortfolio) {
            RetirementPlan.setFlash('success', 'Your portfolio selection has been saved. Next up - set up your retirement expenses!');
          } else {
            RetirementPlan.setFlash('success', 'Your portfolio selection has been saved.');
          }
          route.transitionTo('user.dashboard');
        });
      });
    }

  },

});
