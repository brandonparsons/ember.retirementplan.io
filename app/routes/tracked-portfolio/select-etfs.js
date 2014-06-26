import Ember from 'ember';
import { request as icAjaxRequest } from 'ic-ajax';

export default Ember.Route.extend({

  beforeModel: function() {
    // To come to the track portfolio route, must have completed simulation.
    var currentUser = this.controllerFor('user.current');
    if ( !currentUser.get('hasCompletedSimulation') ) {
      this.transitionTo('retirement_simulation.simulate');
      RetirementPlan.setFlash('notice', 'You have not completed all steps required to set up your tracked portfolio.');
    }
  },

  model: function() {
    var currentUser = this.controllerFor('user.current');
    return currentUser.get('portfolio');
  },

  actions: {

    confirmEtfs: function() {
      var route             = this;
      var store             = this.store;
      var controller        = this.controller;

      icAjaxRequest({
        url: window.RetirementPlanENV.apiHost + '/tracked_portfolios',
        type: 'POST',
        data: {
          current_shares: controller.get('currentShareData'),
          selected_etfs:  controller.get('selectedEtfsData'),
        }
      }).then(function(response) {
        store.pushPayload('portfolio', response); // Ensure store's portfolio has current share data etc.
        route.transitionTo('tracked_portfolio.rebalance');
        RetirementPlan.setFlash('success', 'Holdings saved - calculated balancing requirements.');
      });
    }

  }

});
