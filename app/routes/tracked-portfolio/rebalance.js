import Ember from 'ember';
import { request as icAjaxRequest } from 'ic-ajax';

export default Ember.Route.extend({

  model: function() {
    var currentUser = this.controllerFor('user.current');

    return Ember.RSVP.hash({
      portfolio:  currentUser.get('portfolio'),
      prices:     icAjaxRequest({
        url: window.RetirementPlanENV.apiHost + '/tracked_portfolios/quotes',
        type: 'GET'
      })
    }).then( function(hash) {
      return Ember.Object.create(hash);
    });
  },

  // To come to the rebalance route, must have selected ETFs.
  afterModel: function(model) {
    var route           = this;
    var selectedEtfs    = model.get('portfolio.selectedEtfs');
    var hasSelectedEtfs = !Ember.isEmpty(Ember.keys(selectedEtfs));

    if ( !hasSelectedEtfs ) {
      route.transitionTo('tracked_portfolio.select_etfs');
      RetirementPlan.setFlash('notice', 'You have not completed all steps required to rebalance your portfolio.');
    }
  },

  actions: {

    purchasedUnits: function() {
      var route           = this;
      var currentUser     = this.controllerFor('user.current').get('model');
      var purchasedUnits  = this.controller.get('purchasedUnits');

      icAjaxRequest({
        url: window.RetirementPlanENV.apiHost + '/tracked_portfolios/purchased_units',
        type: 'POST',
        data: { purchased_units: purchasedUnits }
      }).then( function() {
        currentUser.reload(); // So that tracked status is updated
        route.transitionTo('user.dashboard');
        RetirementPlan.setFlash('success', 'Your portfolio is set up and is being tracked!');
      });
    },

    emailInstructions: function() {
      var purchasedUnits  = this.controller.get('purchasedUnits');
      var amount          = this.controller.get('amount');

      icAjaxRequest({
        url: window.RetirementPlanENV.apiHost + '/tracked_portfolios/email_instructions',
        type: 'POST',
        data: {
          amount:           amount,
          purchased_units:  purchasedUnits
        }
      }).then( function() {
        RetirementPlan.setFlash('success', 'E-mail is on its way!');
      });
    },

  },

});
