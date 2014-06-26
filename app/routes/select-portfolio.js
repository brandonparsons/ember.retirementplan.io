import Ember from 'ember';
import { request as icAjaxRequest } from 'ic-ajax';
import FrontierPortfolio from 'retirement-plan/models/frontier-portfolio';

export default Ember.Route.extend(
  Ember.SimpleAuth.AuthenticatedRouteMixin, {

  model: function() { return this.store.find('security'); },

  setupController: function(controller, model) {
    this._super(controller, model);

    // Get the selected tickers and portfolio ID from the server - allows set
    // up of initial state with the proper portfolio selected.
    this._resetSelectionsToCurrent(controller);
  },


  /////////////////////////
  // 'Private' Functions //
  /////////////////////////

  // NB: Working with `FrontierPortfolios` not `Portfolios` (object, not DSModel)

  _resetSelectionsToCurrent: function(thisController) {
    icAjaxRequest({
      url:  window.RetirementPlanENV.apiHost + '/portfolios/selected_for_frontier',
      type: 'GET',
    }).then( function(responseJSON) {
      var allocation, selectedPortfolioID, portfolioTickers;
      selectedPortfolioID = responseJSON.id;
      if (selectedPortfolioID) {
        allocation = FrontierPortfolio.allocationFromID(responseJSON.id);
        thisController.set('selectedPortfolioID', selectedPortfolioID);
        portfolioTickers = Ember.keys(allocation);
        thisController.filter( function(securityItemController) {
          return _.include(portfolioTickers, securityItemController.get('ticker') );
        }).forEach( function(securityToSelect) {
          // This fires the observers each time it is set, but you are debouncing
          // the efficientFrontier/graph update.
          securityToSelect.set('checked', true);
        });
      } else {
        // If the server did not respond with a portfolio, nothing to do (no
        // selections to reset to).
      }
    });
  }

});
