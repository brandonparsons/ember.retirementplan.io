import Ember from 'ember';
import { request as icAjaxRequest } from 'ic-ajax';

export default Ember.Route.extend({

  beforeModel: function() {
    // To come to the "view status" route, must have an existing tracked portfolio.
    var currentUser = this.controllerFor('user.current');
    if ( !currentUser.get('hasTrackedPortfolio') ) {
      this.transitionTo('tracked_portfolio.select_etfs');
      RetirementPlan.setFlash('notice', 'You need to set up a tracked portfolio first.');
    }
  },

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
  }

});
