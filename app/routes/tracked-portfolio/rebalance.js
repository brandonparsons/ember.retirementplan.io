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

  // To come to the rebalance route, must have selected ETFs and selections must
  // be up to date with the current portfolio allocations.
  afterModel: function(model) {
    var route, selectedEtfs, hasSelectedEtfs, selected, required;

    route           = this;
    selectedEtfs    = model.get('portfolio.selectedEtfs');
    hasSelectedEtfs = !Ember.isEmpty(Ember.keys(selectedEtfs));

    if ( !hasSelectedEtfs ) { // They haven't selected their ETF's at all
      route.transitionTo('tracked_portfolio.select_etfs');
      RetirementPlan.setFlash('notice', 'You need to select ETFs for each asset class.');
    } else {
      // If they have changed their portfolio, the selected ETF's may have gotten
      // out of sync with the portfolio asset classes. If so, send them back to
      // select new ETFs.
      selected = new Ember.Set(Ember.keys(selectedEtfs));
      required = new Ember.Set(Ember.keys(model.get('portfolio.weights')));

      if (selected.length !== required.length) {
        // If the length is different to begin with, obviously has changed
        route.transitionTo('tracked_portfolio.select_etfs');
        RetirementPlan.setFlash('notice', 'Looks like you have added/removed one or more asset classes. Please confirm your ETF selections.');
      } else {
        // Lengths are the same, but could have swapped one for another.
        selected.forEach( el => required.remove(el) );
        if (required.length !== 0) {
          route.transitionTo('tracked_portfolio.select_etfs');
          RetirementPlan.setFlash('notice', 'Looks like your asset class selections have changed. Please confirm your ETF selections.');
        }
      }
    }
  },

  deactivate: function() {
    this.get('controller').set('amount', null);
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
        currentUser.reload().then(function() { // So that tracked status is updated
          route.transitionTo('user.dashboard');
          RetirementPlan.setFlash('success', 'Your portfolio is set up and is being tracked!');
        });
      });
    },

    emailInstructions: function() {
      var emailInformation  = this.controller.get('emailInformation');
      var amount            = this.controller.get('amount');
      icAjaxRequest({
        url: window.RetirementPlanENV.apiHost + '/tracked_portfolios/email_instructions',
        type: 'POST',
        data: {
          amount:             amount,
          email_information:  emailInformation
        }
      }).then( function() {
        RetirementPlan.setFlash('success', 'E-mail is on its way!');
      });
    },

  },

});
